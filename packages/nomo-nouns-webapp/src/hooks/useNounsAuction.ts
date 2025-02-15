import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { useNetwork } from 'wagmi';

const NOUNS_AUCTION_ABI = [
  {
    name: 'auction',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'nounId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'bidder', type: 'address' },
      { name: 'settled', type: 'bool' }
    ]
  },
  {
    name: 'settle',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: []
  }
] as const;

const NOUNS_AUCTION_ADDRESS = '0x830BD73E4184ceF73443C15111a1DF14e495C706';

interface AuctionData {
  nounId: bigint;
  amount: bigint;
  startTime: bigint;
  endTime: bigint;
  bidder: string;
  settled: boolean;
}

export const useNounsAuction = () => {
  const { data: auctionData, isError: isReadError } = useContractRead({
    address: NOUNS_AUCTION_ADDRESS,
    abi: NOUNS_AUCTION_ABI,
    functionName: 'auction',
    chainId: mainnet.id,
    onError: (error) => {
      console.error('Auction read error:', error);
    },
    onSuccess: (data) => {
      console.log('Auction data:', data);
    },
  });

  const { config } = usePrepareContractWrite({
    address: NOUNS_AUCTION_ADDRESS,
    abi: NOUNS_AUCTION_ABI,
    functionName: 'settle',
    chainId: mainnet.id, // Always use mainnet
  });

  const { write: settle, isLoading: isSettling } = useContractWrite({
    ...config,
    chainId: mainnet.id, // Always use mainnet
  });

  return {
    currentNounId: auctionData?.nounId ? Number(auctionData.nounId) : undefined,
    isAuctionSettled: auctionData?.settled,
    settle,
    isSettling,
    isReadError,
  };
}; 