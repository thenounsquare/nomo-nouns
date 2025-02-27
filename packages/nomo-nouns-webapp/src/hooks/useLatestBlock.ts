import { useState, useEffect } from 'react';
import { AlchemyProvider } from '@ethersproject/providers';
import { getDatabase, ref, onValue } from 'firebase/database';

interface BlockData {
  blockHash: string | null;
  currentNounId: number | undefined;
}

export const useLatestBlock = (): BlockData => {
  const [blockHash, setBlockHash] = useState<string | null>(null);
  const [currentNounId, setCurrentNounId] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    const provider = new AlchemyProvider('mainnet', import.meta.env.VITE_ALCHEMY_APP_KEY);
    const database = getDatabase();
    let mounted = true;

    // Listen to currentMatch in Firebase for nounId
    const matchRef = ref(database, 'currentMatch');
    const unsubscribe = onValue(matchRef, (snapshot) => {
      if (!mounted) return;
      const data = snapshot.val();
      if (data?.nounId) {
        setCurrentNounId(data.nounId);
      }
    });

    // Subscribe to new blocks via WebSocket for instant hash updates
    const ws = new WebSocket(`wss://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_APP_KEY}`);
    
    ws.onmessage = (event) => {
      if (!mounted) return;
      try {
        const data = JSON.parse(event.data);
        if (data.method === 'eth_subscription' && data.params.result.hash) {
          setBlockHash(data.params.result.hash);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_subscribe',
        params: ['newHeads']
      }));
    };

    // Initial block hash
    provider.getBlock('latest').then(block => {
      if (mounted && block?.hash) {
        setBlockHash(block.hash);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
      ws.close();
    };
  }, []);

  return { blockHash, currentNounId };
}; 