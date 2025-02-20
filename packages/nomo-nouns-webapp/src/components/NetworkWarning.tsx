import { useEffect } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { optimism, optimismGoerli } from 'wagmi/chains';
import { useToast } from '@chakra-ui/react';

export const NetworkWarning = () => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const toast = useToast();
  
  const targetChain = import.meta.env.DEV ? optimismGoerli : optimism;

  useEffect(() => {
    // On initial connection, force switch to Optimism
    if (chain && chain.id !== targetChain.id && !chain.unsupported) {
      switchNetwork?.(targetChain.id);
    }
  }, []); // Empty deps array means this only runs on mount

  useEffect(() => {
    // Show warning when user manually switches to mainnet
    if (chain && chain.id !== targetChain.id) {
      toast({
        title: 'Network Switch Detected',
        description: `You need to be on Optimism to play NOMO. Don't worry about switching to mainnet for settling Nouns - we handle that automatically!`,
        status: 'info',
        duration: 6000,
        isClosable: true,
      });
    }
  }, [chain?.id]);

  return null;
}; 