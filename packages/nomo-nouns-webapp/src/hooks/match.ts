import { useFirebaseState } from "../state/firebaseState";
import { useObjectVal } from "react-firebase-hooks/database";
import {
  ActiveMatch,
  FinishedMatch,
  getMatch,
  getMintPrice,
  MatchData,
  SellingMatch,
} from "../../common/match";
import { get, push, ref, set } from "firebase/database";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { useCallback, useEffect, useRef } from "react";
import { useProvider, useSigner, useNetwork, useSwitchNetwork } from "wagmi";
import { currentTimestamp } from "./useTimestamp";
import {
  getGoerliSdk,
  getOptimismSdk,
  getOptimisticGoerliSdk,
  getOptimismSepoliaSdk,
} from "nomo-nouns-contract-sdks";
import { useQuery } from "react-query";
import { useToast } from "@chakra-ui/react";
import { getClient } from "../config/wagmi";
import { optimism } from "wagmi/chains";
import { optimismSepolia } from "../config/wagmi";

export const match = () => {
  const database = useFirebaseState((state) => state.db);

  const [currentMatchData] = useObjectVal<MatchData>(
    ref(database, "currentMatch")
  );

  return currentMatchData;
};

export const useWarmupForMatch = (match: ActiveMatch) => {
  const functions = useFirebaseState((state) => state.functions);
  const [warmupVoting] = useHttpsCallable<{}>(functions, "vote");
  useEffect(() => {
    if (
      match.currentStage.name === "Warmup" &&
      match.currentStageTimeLeft < 10
    ) {
      const interval = setInterval(() => warmupVoting(), 100);
      return () => clearInterval(interval);
    }
  }, [match.currentStage.name, match.currentStageTimeLeft < 10]);
};

export const useStartNextMatch = () => {
  const { data: signer } = useSigner();

  if (true) {
    // if (import.meta.env.MODE === "emulator") {
    const database = useFirebaseState.getState().db;
    const currentMatchRef = ref(database, "currentMatch");
    const pastMatchesRef = ref(database, "previousMatches");

    return useCallback(async () => {
      const currentMatch = getMatch(
        await get(currentMatchRef).then((m) => m.val())
      );
      const {
        candidateBlocks,
        mintingStartPrice,
        mintingIncreaseInterval,
        mintingPriceIncreasePerInterval,
      } = currentMatch;
     
      const now = currentTimestamp();
      push(pastMatchesRef, currentMatch);
      // here it increases the nounId by 1
      set(currentMatchRef, {
        nounId: currentMatch.nounId + 1,
        candidateBlocks,
        mintingStartPrice,
        mintingIncreaseInterval,
        mintingPriceIncreasePerInterval,
        startTime: now,
        endTime: now + 900,
      } as Partial<MatchData>);
    }, []);
  }

  if (!signer) {
    return () => {};
  }

  const { auctionHouse } = getGoerliSdk(signer!);

  return () =>
    auctionHouse.auction().then((currentAuction) => {
      auctionHouse.createAuction(
        currentAuction.nounId.add(1),
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000) + 86_400,
        false
      );
    });
};

export const useVoteFor = () => {
  const functions = useFirebaseState((state) => state.functions);
  const [vote] = useHttpsCallable<
    { walletAddress: string; blockNumber: number },
    string
  >(functions, "vote");

  // const database = useFirebaseState((state) => state.db);
  //
  // const subject = new Subject<{
  //   currentRound: number;
  //   userWallet: string;
  //   blockNumber: number;
  // }>();
  //
  // subject
  //   .pipe(
  //     tap(({ currentRound, blockNumber, userWallet }) => {
  //       set(
  //         ref(
  //           database,
  //           `currentMatch/votesPerWallet/${userWallet}/${blockNumber}`
  //         ),
  //         increment(1)
  //       );
  //       set(
  //         ref(
  //           database,
  //           `currentMatch/votesPerRound/${currentRound}/${blockNumber}`
  //         ),
  //         increment(1)
  //       );
  //     })
  //   )
  //   .subscribe();

  return useCallback(
    (userWallet: string, blockNumber: number) =>
      vote({ walletAddress: userWallet, blockNumber }),
    // subject.next({
    //   currentRound,
    //   blockNumber,
    //   userWallet,
    // }),
    []
  );
};
export const useMintNomo = (match: SellingMatch | FinishedMatch) => {
  const functions = useFirebaseState((state) => state.functions);
  const [signForMint] = useHttpsCallable<
    {
      nounId: number;
      blocknumberHash: string;
      auctionStartTimestamp: number;
      auctionEndTimestamp: number;
    },
    string
  >(functions, "signForMint");
  const {
    nounId,
    status,
    electedNomoTally: {
      block: { hash: blockNumberHash },
    },
  } = match;
  
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const targetChain = import.meta.env.PROD ? optimism : optimismSepolia;
  const { data: signer } = useSigner();
  const toast = useToast();
  const mintingRef = useRef(false); // Prevent duplicate minting attempts
  
  // Store mint parameters for delayed execution after network switch
  const pendingMintRef = useRef<number | null>(null);
  // Track the previous chain to detect actual changes
  const previousChainRef = useRef(chain?.id);
  // Track retry attempts for signer availability
  const retryAttemptsRef = useRef(0);
  
  const { data: mintSignature } = useQuery(
    ["mintSignature", nounId, blockNumberHash],
    () => {
      return signForMint({
        nounId,
        blocknumberHash: blockNumberHash,
        auctionStartTimestamp: match.startTime,
        auctionEndTimestamp: match.endTime,
      }).then((r) => {
        if (!r?.data) {
          throw "Couldn't get the mint signed";
        }
        return r.data;
      });
    },
    { 
      enabled: status === "Selling",
      retry: false
    }
  );
  
  // Define the executeMint function early to avoid reference issues
  const executeMint = useCallback(async (quantity: number) => {
    if (!signer || !mintSignature) {
      return false;
    }
    
    if (mintingRef.current) {
      return false;
    }
    
    mintingRef.current = true;
    
    try {
      const { nomoToken } = import.meta.env.PROD
        ? getOptimismSdk(signer)
        : getOptimismSepoliaSdk(signer);
        
      const mintPrice = getMintPrice(Math.floor(Date.now() / 1000), match);
      const { hash } = match.electedNomoTally.block;
      
      const tx = await nomoToken.mint(
        nounId,
        hash,
        match.startTime,
        match.endTime,
        quantity,
        mintSignature,
        {
          value: mintPrice.mul(quantity),
        }
      );
      
      toast({
        title: "Transaction Submitted",
        description: "Your mint transaction has been submitted to the network.",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      
      await tx.wait();
      
      toast({
        title: "Mint Successful",
        description: `Successfully minted ${quantity} Nomo${quantity > 1 ? "s" : ""}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return true;
    } catch (error) {
      toast({
        title: "Mint Failed",
        description: `Failed to mint. ${(error as Error).message || "Check your wallet for details."}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return false;
    } finally {
      mintingRef.current = false;
    }
  }, [signer, mintSignature, match, nounId, toast, chain?.id]);
  
  // This effect runs when the network changes or signer updates
  useEffect(() => {
    // Only proceed if we have a pending mint and the chain has actually changed to the target chain
    if (chain?.id !== previousChainRef.current && 
        chain?.id === targetChain.id && 
        pendingMintRef.current !== null) {
      
      // If we have a signer, execute the mint
      if (signer) {
        const quantity = pendingMintRef.current;
        pendingMintRef.current = null; // Clear the pending mint
        retryAttemptsRef.current = 0; // Reset retry counter
        
        // Execute the mint
        executeMint(quantity);
      } 
      // If no signer yet but we haven't exceeded retry attempts, set up a retry
      else if (retryAttemptsRef.current < 10) {
        retryAttemptsRef.current++;
        
        // Try again in a moment
        setTimeout(() => {
          // Force a re-render to trigger this effect again
          previousChainRef.current = 0; // Set to invalid chain ID to force the condition to evaluate again
        }, 500);
      }
      // If we've exceeded retry attempts, give up and show an error
      else {
        toast({
          title: "Mint Failed",
          description: "Failed to get a valid signer after network switch. Please try minting again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        pendingMintRef.current = null;
        retryAttemptsRef.current = 0;
      }
    }
    
    // Update the previous chain reference
    previousChainRef.current = chain?.id;
  }, [chain?.id, targetChain.id, executeMint, signer, toast]);
  
  if (!signer || !mintSignature) {
    return { canMint: false, mintNomo: undefined };
  }

  // The public-facing mint function that handles network switching
  const mintNomo = async (quantity: number) => {
    // If already minting, don't allow another attempt
    if (mintingRef.current) {
      return;
    }
    
    // If we're not on the right network, switch and store the mint for later
    if (chain?.id !== targetChain.id) {
      toast({
        title: 'Switching Network',
        description: 'Switching to Optimism and minting automatically...',
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      
      // Store the mint parameters for after the network switch
      pendingMintRef.current = quantity;
      retryAttemptsRef.current = 0; // Reset retry counter
      
      try {
        await switchNetwork?.(targetChain.id);
        // The useEffect will handle executing the mint after the network switch
      } catch (error) {
        pendingMintRef.current = null; // Clear the pending mint
        toast({
          title: 'Network Switch Failed',
          description: 'Failed to switch to Optimism. Please switch manually and try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
      return;
    }

    // If we're already on the right network, mint immediately
    await executeMint(quantity);
  };

  return { canMint: true, mintNomo };
};

export const useDisqualifiedNotification = (match: ActiveMatch) => {
  const previousDisqualifiedWalletsRef = useRef(
    Object.keys(match.disqualifiedWallets ?? {})
  );

  const toast = useToast();
  const provider = getClient().provider;
  useEffect(() => {
    Object.keys(match.disqualifiedWallets ?? {}).forEach((wallet) => {
      if (
        toast.isActive(wallet) ||
        previousDisqualifiedWalletsRef.current.includes(wallet)
      ) {
        return;
      }

      const toastId = toast({
        id: wallet,
        title: "Player disqualified",
        description: `Player ${wallet} disqualified for super-human mashing 🤖`,
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });

      provider.lookupAddress(wallet).then((name) => {
        if (!name) {
          return;
        }

        toast.update(toastId, {
          description: `Player ${name} disqualified for super-human mashing 🤖`,
          status: "warning",
        });
      });
    });

    previousDisqualifiedWalletsRef.current = Object.keys(
      match.disqualifiedWallets ?? {}
    );
  }, [Object.keys(match.disqualifiedWallets ?? {})]);
};