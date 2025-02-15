import { Center, VStack } from "@chakra-ui/react";
import { MatchSection } from "./components/MatchSection";
import { useIdleDetection } from "./hooks/session";
import { Header } from "./components/Header";
import { useIsMobile } from "./hooks/isMobile";
import { Footer } from "./components/Footer";
import { NomoLoading } from "./components/NomoLoading";
import { keyframes } from '@emotion/react';

function App() {
  const isIdle = useIdleDetection();
  const isMobile = useIsMobile();

  if (isIdle) {
    return (
      <Center w={"full"} h={"full"}>
        <NomoLoading boxSize={"sm"} />
      </Center>
    );
  }

  return (
    <VStack
      w="full"
      h={"full"}
      spacing={0}
      overflow={"hidden"}
      justifyContent={"stretch"}
    >
      <Header />
      <MatchSection />
      <Footer />
    </VStack>
  );
}

const pulsating = keyframes`
  from {
    opacity: 0.4;
  }
  to {
    opacity: 0.2;
  }
`;

export default App;
