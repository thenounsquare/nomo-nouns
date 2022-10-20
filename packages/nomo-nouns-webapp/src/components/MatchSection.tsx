import { FC, useMemo } from "react";
import { useTimestamp } from "../hooks/useTimestamp";
import { getMatch } from "../../common/match";
import { Center, Image, Text, VStack } from "@chakra-ui/react";
import nomoggles from "../assets/animatedNomoggles.gif";
import { match } from "../hooks/match";
import { ActivePhase } from "./ActivePhase";
import { SellingPhase } from "./SellingPhase";
import { NomoLoading } from "./NomoLoading";

export type MatchSectionProps = {};

export const MatchSection: FC<MatchSectionProps> = () => {
  const phase = useCurrentPhase();

  return (
    <Center pt={4} m={0} flexGrow={1} w={"full"} overflowY={"scroll"}>
      {phase}
    </Center>
  );
};

const useCurrentPhase = () => {
  const currentMatchData = match();
  const now = useTimestamp();
  const currentMatch = useMemo(
    () => (!!currentMatchData ? getMatch(currentMatchData) : currentMatchData),
    [currentMatchData, now]
  );

  if (currentMatch === null) {
    return (
      <VStack p={4}>
        <Text textAlign={"center"} fontSize={["lg", "xl"]}>
          The perfect Noun just slipped away on FOMO? Say NOMO, homie!
        </Text>
        <Image src={nomoggles} w={"xs"} />
        <Text fontSize={["lg", "xl"]}>Available soon™ at NOC</Text>
      </VStack>
    );
  }

  if (currentMatch === undefined) {
    return <NomoLoading boxSize={"xs"} />;
  }

  if (currentMatch.status === "Active") {
    return <ActivePhase match={currentMatch} />;
  }

  return <SellingPhase match={currentMatch} />;
};
