import { useEffect, useState } from 'react';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { mainnet } from 'viem/chains';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useToast } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

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

const NOUNS_AUCTION_ADDRESS = '0x830BD73E4184ceF73443C15111a1DF14e495C706';

// Create a dedicated mainnet client
const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http('https://eth-mainnet.g.alchemy.com/v2/LjGiGtmIeZS9R1we1bibphWLlLLv8ZOX')
});

export const useNounsAuction = () => {
  const { address } = useAccount();
  const toast = useToast();
  const [auctionState, setAuctionState] = useState<{
    currentNounId?: number;
    isAuctionSettled: boolean;
    endTime?: number;
  }>({
    isAuctionSettled: false
  });

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

  const settle = async () => {
    if (!address || !window.ethereum) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to settle the Nouns auction',
        status: 'error',
      });
      return;
    }

    try {
      // Proceed directly to settlement since we know the button only shows when appropriate
      const walletClient = await createWalletClient({
        chain: mainnet,
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
        description: `Transaction Sent`,
        status: 'success',
      });
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
        }
      }

      toast({
        title: 'Settlement Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return {
    ...auctionState,
    settle,
    isSettling: false,
  };
}; 