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
    // Always force switch to Optimism when chain changes (except during settle which handles its own switching)
    if (chain && chain.id !== targetChain.id && !chain.unsupported) {
      switchNetwork?.(targetChain.id);
      toast({
        title: 'Network Switch',
        description: 'NOMO only works on Optimism. If you\'re trying to settle Nouns, we\'ll handle the network switching automatically.',
        status: 'info',
        duration: 6000,
        isClosable: true,
      });
    }
  }, [chain?.id]); // Run whenever chain changes

  return null;
}; 