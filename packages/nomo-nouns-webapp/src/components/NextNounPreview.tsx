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

  // Create a reusable frame component to maintain consistent layout
  const NounFrame = ({ children }: { children: React.ReactNode }) => (
    <VStack w="full" spacing={6}>
      <Divider borderColor="gray.600" />
      <Center w="full" bg="gray.800" borderRadius="xl" p={8}>
        <VStack spacing={6} align="center" maxW="container.sm">
          <Text fontSize="lg" fontWeight="bold" color="white">
            Next Noun{nextNounIds.length > 1 ? 's' : ''} Preview
          </Text>
          <HStack spacing={6} align="start">
            {nextNounIds.map((id) => (
              <VStack key={id}>
                <Text color="white" fontSize="lg">
                  Noun {id}
                  {id.toString().endsWith('0') ? ' (Nounders)' : ''}
                </Text>
                <Box 
                  w="320px"
                  position="relative"
                  _before={{
                    content: '""',
                    display: 'block',
                    paddingTop: '100%' // This creates a 1:1 aspect ratio
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
                    {children}
                  </Center>
                </Box>
              </VStack>
            ))}
          </HStack>
        </VStack>
      </Center>
    </VStack>
  );

  // Memoize the preview content
  const previewContent = useMemo(() => {
    if (loading) {
      return (
        <NounFrame>
          <Text color="white">Generating preview...</Text>
        </NounFrame>
      );
    }

    if (error) {
      return (
        <NounFrame>
          <Text color="white">Error: {error}</Text>
        </NounFrame>
      );
    }

    return (
      <NounFrame>
        {nounPreviews.map((preview) => (
          <Box
            key={preview.id}
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
          >
            <img 
              src={`data:image/svg+xml;base64,${preview.svg}`}
              alt={`Noun ${preview.id} Preview`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
        ))}
      </NounFrame>
    );
  }, [loading, error, nounPreviews, nextNounIds]);

  return previewContent;
};

// Usage example for testing:
// <NextNounPreview testNounId={9} /> // Will show previews for Nouns 10 and 11
// <NextNounPreview testNounId={19} /> // Will show previews for Nouns 20 and 21
// <NextNounPreview /> // Normal production behavior 