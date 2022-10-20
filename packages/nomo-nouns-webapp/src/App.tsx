import {
  Center,
  Container,
  Image,
  keyframes,
  Text,
  VStack,
} from "@chakra-ui/react";
import Nomoggles from "./assets/nomoggles.svg";
import { MatchSection } from "./components/MatchSection";
import { useIdleDetection } from "./hooks/session";
import { Header } from "./components/Header";
import { useIsMobile } from "./hooks/isMobile";
import { Footer } from "./components/Footer";
import { NomoLoading } from "./components/NomoLoading";

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
      {isMobile && <Footer />}
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
