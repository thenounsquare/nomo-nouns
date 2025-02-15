import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { VStack, Text, Box, Center, HStack, Divider } from '@chakra-ui/react';
import { useLatestBlock } from '../hooks/useLatestBlock';
import { ImageData, getNounData, getNounSeedFromBlockHash } from '@nomonouns/assets';
import { buildSVG } from '@nouns/sdk';

interface NounPreview {
  id: string;
  svg: string;
}

interface NextNounPreviewProps {
  testNounId?: number; // Add optional test prop
}

export const NextNounPreview: FC<NextNounPreviewProps> = ({ testNounId }) => {
  const [nounPreviews, setNounPreviews] = useState<NounPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { blockHash: latestBlockHash, currentNounId } = useLatestBlock();

  // Use testNounId if provided, otherwise use currentNounId
  const effectiveNounId = testNounId ?? currentNounId;

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
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Error generating noun previews:', error);
          setError(errorMessage);
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

  // Memoize the preview content
  const previewContent = useMemo(() => {
    if (loading) {
      return (
        <Center w="full" h="320px" bg="gray.800" borderRadius="xl">
          <Text color="white">Generating preview...</Text>
        </Center>
      );
    }

    if (error) {
      return (
        <Center w="full" h="320px" bg="gray.800" borderRadius="xl">
          <Text color="white">Error: {error}</Text>
        </Center>
      );
    }

    return (
      <VStack w="full" spacing={6}>
        <Divider borderColor="gray.600" />
        <Center w="full" bg="gray.800" borderRadius="xl" p={8}>
          <VStack spacing={6} align="center" maxW="container.sm">
            <Text fontSize="lg" fontWeight="bold" color="white">
              Next Noun{nounPreviews.length > 1 ? 's' : ''} Preview
            </Text>
            <HStack spacing={6} align="start">
              {nounPreviews.map((preview) => (
                <VStack key={preview.id}>
                  <Text color="white" fontSize="lg">
                    Noun {preview.id}
                    {preview.id.endsWith('0') ? ' (Nounders)' : ''}
                  </Text>
                  <Box 
                    w="full" 
                    maxW="320px" 
                    h="320px" 
                    bg="gray.900"
                    borderRadius="xl"
                    overflow="hidden"
                    border="2px solid"
                    borderColor="gray.700"
                  >
                    <img 
                      src={`data:image/svg+xml;base64,${preview.svg}`}
                      alt={`Noun ${preview.id} Preview`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                </VStack>
              ))}
            </HStack>
          </VStack>
        </Center>
      </VStack>
    );
  }, [loading, error, nounPreviews]);

  return previewContent;
};

// Usage example for testing:
// <NextNounPreview testNounId={9} /> // Will show previews for Nouns 10 and 11
// <NextNounPreview testNounId={19} /> // Will show previews for Nouns 20 and 21
// <NextNounPreview /> // Normal production behavior 