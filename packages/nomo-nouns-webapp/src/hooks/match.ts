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
import { useProvider, useSigner } from "wagmi";
import { currentTimestamp } from "./useTimestamp";
import {
  getGoerliSdk,
  getOptimismSdk,
  getOptimisticGoerliSdk,
} from "nomo-nouns-contract-sdks";
import { useQuery } from "react-query";
import { useToast } from "@chakra-ui/react";
import { getClient } from "../config/wagmi";

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
      candidateBlocks.forEach((candidate) => {
        console.log(
          `this is one of the candidates on the front-end when calling start new match: \n currentMatch: ${
            currentMatch.nounId + 1
          } \n current hash  ${candidate.hash}, \ncandidate number: ${
            candidate.number
          }, \n candidate seed: ${candidate.seed}`
        );
      });
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

  const { data: mintSignature } = useQuery(
    ["mintSignature", nounId, blockNumberHash],
    () =>
      signForMint({
        nounId,
        blocknumberHash: blockNumberHash,
        auctionStartTimestamp: match.startTime,
        auctionEndTimestamp: match.endTime,
      }).then((r) => {
        if (!r?.data) {
          throw "Couldn't get the mint signed";
        }

        return r.data;
      }),
    { enabled: status === "Selling" }
  );
  const { data: signer } = useSigner();
  const toast = useToast();

  if (!signer || !mintSignature) {
    return { canMint: false, mintNomo: undefined };
  }

  //Should uncomment and add Optimism SDK
  const { nomoToken } = import.meta.env.PROD
    ? getOptimismSdk(signer)
    : getOptimisticGoerliSdk(signer);

  const mintNomo = async (quantity: number) => {
    const mintPrice = getMintPrice(Math.floor(Date.now() / 1000), match);
    const { hash } = match.electedNomoTally.block;
    console.log(
      `this is the elected nomo on the front-end \n \n nounId: ${nounId},\n blockNumberHash: ${blockNumberHash},\n auctionStartTimestamp: ${match.startTime}, \n auctionEndTimestamp: ${match.endTime},\n mintSignature: ${mintSignature}`
    );

    return nomoToken
      .mint(
        nounId,
        hash,
        match.startTime,
        match.endTime,
        quantity,
        mintSignature,
        {
          value: mintPrice.mul(quantity),
        }
      )
      .then((tx: { wait: () => void }) => tx.wait())
      .then(() => {
        toast({
          title: "Mint successful",
          description: `Successfully minted ${quantity} Nomo${
            quantity > 1 ? "s" : ""
          }.`,
          status: "success",
          isClosable: true,
          position: "top-right",
        });
      })
      .catch(() => {
        toast({
          title: "Mint failed",
          description: `Failed to mint ${quantity} Nomo${
            quantity > 1 ? "s" : ""
          }. Check your wallet for details.`,
          status: "error",
          isClosable: true,
          position: "top-right",
        });
      });
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
