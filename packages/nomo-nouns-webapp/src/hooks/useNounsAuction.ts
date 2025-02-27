import { useEffect, useState, useRef, useCallback } from 'react';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { mainnet, optimism, sepolia } from 'viem/chains';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useToast } from '@chakra-ui/react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

const NOUNS_AUCTION_ABI = [
  {
    name: 'settleCurrentAndCreateNewAuction',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: []
  },
  {
    name: 'paused',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'bool' }]
  }
] as const;

// L1 chain for Nouns auction settlement
const settlementChain = import.meta.env.PROD ? mainnet : sepolia;

// L1 Nouns auction address
const NOUNS_AUCTION_ADDRESS = import.meta.env.PROD 
  ? '0x830BD73E4184ceF73443C15111a1DF14e495C706'  // Mainnet
  : '0x488609b7113FCf3B761A05956300d605E8f6BcAf'; // Sepolia

// Create a dedicated mainnet client
const mainnetClient = createPublicClient({
  chain: settlementChain,
  transport: http(`https://eth-${settlementChain.network}.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_APP_KEY}`)
});

export const useNounsAuction = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const toast = useToast();
  const [auctionState, setAuctionState] = useState<{
    currentNounId?: number;
    isAuctionSettled: boolean;
    endTime?: number;
  }>({
    isAuctionSettled: false
  });
  
  // New refs for tracking settlement state
  const isSettlingRef = useRef(false);
  const pendingSettleRef = useRef<boolean | null>(null);
  const previousChainRef = useRef(chain?.id);
  const retryAttemptsRef = useRef(0);

  useEffect(() => {
    const database = getDatabase();
    const currentMatchRef = ref(database, 'currentMatch');
    
    return onValue(currentMatchRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAuctionState({
          currentNounId: data.nounId,
          endTime: data.endTime,
          isAuctionSettled: Boolean(data.settled)
        });
      }
    });
  }, []);

  // Define the executeSettle function early to avoid reference issues
  const executeSettle = useCallback(async () => {
    if (!address || !window.ethereum) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to settle the Nouns auction',
        status: 'error',
        position: 'top-right',
      });
      return false;
    }

    if (isSettlingRef.current) {
      return false;
    }

    isSettlingRef.current = true;

    try {
      const walletClient = await createWalletClient({
        chain: settlementChain,
        transport: custom(window.ethereum)
      });

      const { request } = await mainnetClient.simulateContract({
        address: NOUNS_AUCTION_ADDRESS,
        abi: NOUNS_AUCTION_ABI,
        functionName: 'settleCurrentAndCreateNewAuction',
        account: address,
      });

      const hash = await walletClient.writeContract(request);

      toast({
        title: 'Settlement Submitted',
        description: 'Transaction sent. Waiting for confirmation...',
        status: 'success',
        position: 'top-right',
      });

      await mainnetClient.waitForTransactionReceipt({ hash });

      toast({
        title: 'Settlement Successful',
        description: 'Auction has been settled',
        status: 'success',
        position: 'top-right',
      });
      
      return true;
    } catch (error) {
      console.error('Settlement error:', error);
      
      let errorMessage = 'Unable to settle auction at this time.';
      if (error instanceof Error) {
        if (error.message.includes('not paused')) {
          errorMessage = 'Current auction must be finished to settle auction.';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient ETH to cover gas fees.';
        } else if (error.message.includes('already been settled')) {
          errorMessage = 'This auction has already been settled.';
        } else if (error.message.includes('rejected') || error.message.includes('denied')) {
          errorMessage = 'Transaction rejected by user.';
        }
      }

      toast({
        title: 'Settlement Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        position: 'top-right',
      });
      
      return false;
    } finally {
      isSettlingRef.current = false;
    }
  }, [address, toast]);

  // This effect runs when the network changes
  useEffect(() => {
    // Only proceed if we have a pending settlement and the chain has actually changed to the target chain
    if (chain?.id !== previousChainRef.current && 
        chain?.id === settlementChain.id && 
        pendingSettleRef.current !== null) {
      
      // If we have ethereum access, execute the settlement
      if (window.ethereum) {
        // Clear the pending settlement
        pendingSettleRef.current = null;
        retryAttemptsRef.current = 0;
        
        // Execute the settlement
        executeSettle();
      } 
      // If no ethereum access yet but we haven't exceeded retry attempts, set up a retry
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
          title: 'Settlement Failed',
          description: 'Failed to access wallet after network switch. Please try settling again.',
          status: 'error',
          duration: 5000,
          position: 'top-right',
        });
        pendingSettleRef.current = null;
        retryAttemptsRef.current = 0;
      }
    }
    
    // Update the previous chain reference
    previousChainRef.current = chain?.id;
  }, [chain?.id, executeSettle, toast]);

  // The public-facing settle function that handles network switching
  const settle = async () => {
    if (!address || !window.ethereum) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to settle the Nouns auction',
        status: 'error',
        position: 'top-right',
      });
      return;
    }

    // If already settling, don't allow another attempt
    if (isSettlingRef.current) {
      return;
    }
    
    // If we're not on the right network, switch and store the settlement for later
    if (chain?.id !== settlementChain.id) {
      toast({
        title: 'Switching Network',
        description: import.meta.env.DEV 
          ? 'Switching to Sepolia for settlement...'
          : 'Switching to Ethereum for settlement...',
        status: 'info',
        position: 'top-right',
      });
      
      // Store the settlement intent for after the network switch
      pendingSettleRef.current = true;
      retryAttemptsRef.current = 0; // Reset retry counter
      
      try {
        await switchNetwork?.(settlementChain.id);
        // The useEffect will handle executing the settlement after the network switch
      } catch (error) {
        pendingSettleRef.current = null; // Clear the pending settlement
        toast({
          title: 'Network Switch Failed',
          description: 'Failed to switch networks. Please switch manually and try again.',
          status: 'error',
          duration: 5000,
          position: 'top-right',
        });
      }
      return;
    }

    // If we're already on the right network, settle immediately
    await executeSettle();
  };

  return {
    ...auctionState,
    settle,
    isSettling: isSettlingRef.current,
  };
}; 