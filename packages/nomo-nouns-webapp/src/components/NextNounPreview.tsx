import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { Heading, VStack, Text, Box, Center, HStack, Divider, Button } from '@chakra-ui/react';
import { useLatestBlock } from '../hooks/useLatestBlock';
import { ImageData, getNounData, getNounSeedFromBlockHash } from '@nomonouns/assets';
import { buildSVG } from '@nouns/sdk';
import { mainnet } from 'wagmi/chains';
import { useNounsAuction } from '../hooks/useNounsAuction';
import { NomoLoading } from './NomoLoading';
import { getDatabase, ref, onValue } from 'firebase/database';
import { createPublicClient, http } from 'viem';

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http('https://eth-mainnet.g.alchemy.com/v2/LjGiGtmIeZS9R1we1bibphWLlLLv8ZOX')
});

const NOUNS_AUCTION_ADDRESS = '0x830BD73E4184ceF73443C15111a1DF14e495C706';
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

interface NounPreview {
  id: string;
  svg: string;
}

export const NextNounPreview: FC<{
  testNounId?: number;
  showSettleButton?: boolean;
}> = ({ testNounId, showSettleButton = false }) => {
  const [nounPreviews, setNounPreviews] = useState<NounPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMatch, setCurrentMatch] = useState<{
    nounId: number;
    endTime: number;
  } | null>(null);
  const { blockHash: latestBlockHash } = useLatestBlock();
  const { settle, isSettling } = useNounsAuction();

  useEffect(() => {
    const database = getDatabase();
    const currentMatchRef = ref(database, 'currentMatch');
    
    return onValue(currentMatchRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentMatch({
          nounId: data.nounId,
          endTime: data.endTime
        });
      }
    });
  }, []);

  const effectiveNounId = testNounId ?? currentMatch?.nounId;

  // Only show settle button if:
  // 1. We're in test mode with showSettleButton=true, OR
  // 2. We're in production and the auction has ended
  const canSettle = showSettleButton || (
    !testNounId && // Not in test mode
    currentMatch?.endTime && // Have end time
    Date.now() > currentMatch.endTime * 1000 // Auction has ended
  );

  // Memoize the next noun IDs calculation
  const nextNounIds = useMemo(() => {
    if (effectiveNounId === undefined) return [];
    
    const nextId = effectiveNounId + 1;
    // If current noun ends in 9, show both the next nouns (ending in 0 and 1)
    return effectiveNounId % 10 === 9 ? [nextId, nextId + 1] : [nextId];
  }, [effectiveNounId]);

  // Memoize the expensive SVG generation function
  const generateNounSvg = useCallback(async (nounId: string, blockHash: string) => {
    const seed = getNounSeedFromBlockHash(nounId, blockHash);
    const { parts, background } = getNounData(seed);
    const svgBinary = buildSVG(parts, ImageData.palette, background);
    return btoa(svgBinary);
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!latestBlockHash || nextNounIds.length === 0) {
      setLoading(true);
      return;
    }

    const updateNounPreviews = async () => {
      try {
        setLoading(true);
        const previews = await Promise.all(
          nextNounIds.map(async (id) => ({
            id: id.toString(),
            svg: await generateNounSvg(id.toString(), latestBlockHash)
          }))
        );
        
        if (mounted) {
          setNounPreviews(previews);
          setError(null);
        }
      } catch (error) {
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Unknown error');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    updateNounPreviews();

    return () => {
      mounted = false;
    };
  }, [latestBlockHash, nextNounIds, generateNounSvg]);

  // Frame component without the divider
  const NounFrame = ({ preview, isLoading }: { preview?: NounPreview, isLoading?: boolean }) => (
    <Center w="full" bg="gray.800" borderRadius="xl" p={8}>
      <VStack spacing={6} align="center" maxW="container.sm">
        <VStack>
          <Text color="white" fontSize="lg">
            {isLoading ? "Loading..." : `Noun ${preview?.id}${preview?.id.endsWith('0') ? ' (Nounders)' : ''}`}
          </Text>
          <Box 
            w="320px"
            position="relative"
            _before={{
              content: '""',
              display: 'block',
              paddingTop: '100%'
            }}
            bg="gray.900"
            borderRadius="xl"
            overflow="hidden"
            border="2px solid"
            borderColor="gray.700"
          >
            <Center
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
            >
              {isLoading ? (
                <Box p={8}>
                  <NomoLoading boxSize="xs" />
                </Box>
              ) : (
                <img 
                  src={`data:image/svg+xml;base64,${preview?.svg}`}
                  alt={`Noun ${preview?.id} Preview`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              )}
            </Center>
          </Box>
        </VStack>
      </VStack>
    </Center>
  );

  // Preview content with a single title
  const previewContent = useMemo(() => {
    const content = error ? (
      <NounFrame preview={{ id: '0', svg: '' }} />
    ) : (
      <HStack spacing={6} align="start">
        {loading ? (
          nextNounIds.map(id => (
            <NounFrame key={id} isLoading={true} />
          ))
        ) : (
          nounPreviews.map(preview => (
            <NounFrame key={preview.id} preview={preview} />
          ))
        )}
      </HStack>
    );

    return (
      <VStack spacing={0}>
        <Heading fontSize="xl" fontWeight="bold" color="white">
          Pick The Next Noun{nextNounIds.length > 1 ? 's' : ''}!
        </Heading>
        {content}
      </VStack>
    );
  }, [loading, error, nounPreviews, nextNounIds]);

  return (
    <VStack w="full" spacing={6}>
      <Divider borderColor="gray.600" />
      {previewContent}
      <Center>
        {canSettle ? (
          <Button
            colorScheme="blue"
            onClick={() => settle?.()}
            isLoading={isSettling}
            isDisabled={!settle}
            w="320px"
          >
            Mint {nextNounIds.length > 1 ? 'These Nouns' : 'This Noun'}
          </Button>
        ) : (
          <Text color="gray.400" textAlign="center">
            You can pick the next {nextNounIds.length > 1 ? 'nouns' : 'noun'} by settling here once the current auction is over.
          </Text>
        )}
      </Center>
    </VStack>
  );
};

// Usage examples:
// <NextNounPreview testNounId={9} showSettleButton={true} /> // Test with button
// <NextNounPreview testNounId={19} /> // Test without button
// <NextNounPreview /> // Production behavior 