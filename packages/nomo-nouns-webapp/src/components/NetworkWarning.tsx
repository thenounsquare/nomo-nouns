import { useEffect } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { optimism, sepolia, mainnet } from 'wagmi/chains';
import { optimismSepolia } from '../config/wagmi';
import { useToast } from '@chakra-ui/react';

export const NetworkWarning = () => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const toast = useToast();
  
  const targetChain = import.meta.env.DEV ? optimismSepolia : optimism;
  const settlementChain = import.meta.env.DEV ? sepolia : mainnet;

  useEffect(() => {
    // Only switch to Optimism on initial connection
    if (!chain) return;
    
    if (chain.unsupported) {
      toast({
        title: 'Unsupported Network',
        description: import.meta.env.DEV 
          ? 'Please switch to Optimism Sepolia or Sepolia'
          : 'Please switch to Optimism or Ethereum Mainnet',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    // First connection defaults to Optimism
    if (chain.id !== targetChain.id && !localStorage.getItem('hasConnectedBefore')) {
      switchNetwork?.(targetChain.id);
      localStorage.setItem('hasConnectedBefore', 'true');
    }
  }, [chain]);

  return null;
}; 