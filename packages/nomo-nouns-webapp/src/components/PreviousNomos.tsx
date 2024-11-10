import { useFirebaseState } from "../state/firebaseState";
import { FinishedMatch } from "../../common/match";
import { get, limitToLast, onValue, query, ref } from "firebase/database";
import {
  Heading,
  HStack,
  Image,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
// import { NounSeed } from "@nouns/assets/dist/types";
import { NounSeed } from "@nomonouns/assets/dist/types";
import { useNomoImage } from "./NomoImage";
import { FC, useEffect, useState } from "react";

export const PreviousNomos = () => {
  const database = useFirebaseState((state) => state.db);
  const [previousMatches, setPreviousMatches] = useState<FinishedMatch[]>();

  useEffect(() => {
    get(query(ref(database, "previousMatches"), limitToLast(6))).then((r) =>
      setPreviousMatches(Object.values(r.val() ?? []))
    );

    return onValue(
      query(ref(database, "previousMatches"), limitToLast(6)),
      (r) => setPreviousMatches(Object.values(r.val() ?? []))
    );
  }, []);

  return (
    <>
      {previousMatches && previousMatches.length > 0 && (
        <VStack py={6} w={"full"} borderTopWidth={1} justifyContent={"center"}>
          <Heading>Previous Nomos</Heading>
          <HStack
            px={6}
            overflowX={"scroll"}
            spacing={[4, 8]}
            w={"full"}
            justifyContent={["initial", "center"]}
          >
            {[...previousMatches].reverse().map((match) => (
              <PreviousNomo
                minW={"96px"}
                maxW={"160px"}
                key={match.nounId}
                nounId={match.nounId}
                seed={match.electedNomoTally.block.seed}
              />
            ))}
          </HStack>
        </VStack>
      )}
    </>
  );
};

type PreviousNomoProps = {
  nounId: number;
  seed: NounSeed;
} & StackProps;

const PreviousNomo: FC<PreviousNomoProps> = ({ nounId, seed, ...props }) => {
  const { nomoImage } = useNomoImage(seed);

  return (
    <VStack spacing={0} {...props}>
      <Text>Nomo #{nounId}</Text>
      <Image src={nomoImage} w={"full"} borderRadius={"md"} />
    </VStack>
  );
};
