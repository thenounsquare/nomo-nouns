import { useEffect, useState } from 'react';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { mainnet, optimism } from 'viem/chains';
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

const NOUNS_AUCTION_ADDRESS = '0x830BD73E4184ceF73443C15111a1DF14e495C706';

// Create a dedicated mainnet client
const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http('https://eth-mainnet.g.alchemy.com/v2/LjGiGtmIeZS9R1we1bibphWLlLLv8ZOX')
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
  const [isSettling, setIsSettling] = useState(false);

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
        position: 'top-right',
      });
      return;
    }

    setIsSettling(true);

    try {
      const walletClient = await createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum)
      });

      if (chain?.id !== mainnet.id) {
        toast({
          title: 'Switching Network',
          description: 'Switching to Ethereum for settlement...',
          status: 'info',
          position: 'top-right',
        });
        
        await switchNetwork?.(mainnet.id);
      }

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
    } finally {
      setIsSettling(false);
    }
  };

  return {
    ...auctionState,
    settle,
    isSettling,
  };
}; 