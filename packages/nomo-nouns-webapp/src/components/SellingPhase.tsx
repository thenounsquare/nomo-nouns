import { FinishedMatch, getMintPrice, SellingMatch } from "../../common/match";
import { FC, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useTimestamp } from "../hooks/useTimestamp";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "ethers/lib/utils";
import fomoCssOverrides from "./fomo-overrides.css";
import {
  Button,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  chakra,
  SimpleGrid,
} from "@chakra-ui/react";
import { NomoCard } from "../NomoCard";
import { PreviousNomos } from "./PreviousNomos";
import { formatCountdown } from "../utils/formatCountdown";
import { useMintNomo, useStartNextMatch } from "../hooks/match";
import { BigNumber } from "ethers";
import { NomoSaleCard } from "./NomoSaleCard";

export type SellingPhaseProps = {
  match: SellingMatch | FinishedMatch;
};

export const SellingPhase: FC<SellingPhaseProps> = ({ match }) => {
  const { isDisconnected } = useAccount();
  const saleOver = match.status === "Finished";
  const nextMatch = useStartNextMatch();
  // @ts-ignore
  return (
    <VStack h={"full"} spacing={[6, 10]} w={"full"}>
      <SimpleGrid
        w={"full"}
        templateAreas={[
          saleOver
            ? `"noun-title"
           "noun"
           "nomo-title"
           "nomo"`
            : `"nomo-title"
           "nomo"
           "noun-title"
           "noun"`,
          `"noun-title nomo-title"
           "noun nomo"`,
        ]}
        templateColumns={["352px", "352px 352px"]}
        columnGap={{ base: 4, sm: 8, lg: 24 }}
        rowGap={4}
        justifyContent={"center"}
        justifyItems={"center"}
        alignItems={"end"}
      >
        <Text gridArea={"noun-title"} fontSize={"lg"} fontWeight={"bold"}>
          {saleOver ? "Pick the next Noun!" : "Watch the Nouns auction"}
        </Text>
        <VStack
          gridArea={"nomo-title"}
          alignItems={"center"}
          spacing={0}
          lineHeight={"normal"}
        >
          <Text fontSize={"lg"} fontWeight={"bold"}>
            Nomo Noun #{match.nounId}
          </Text>
          <Text fontSize={"sm"}>
            Born {new Date(match.matchEnd * 1000).toDateString()}
          </Text>
          {!saleOver && (
            <Text fontSize={["xs", "sm"]}>
              The sooner you mint, the cheaper it is!
            </Text>
          )}
        </VStack>
        <chakra.iframe
          gridArea={"noun"}
          id={"noun"}
          borderRadius={"md"}
          w={"full"}
          h={"520px"}
          src={
            saleOver ? "https://fomonouns.wtf/" : "https://www.nounoclock.app/"
          }
        />
        <NomoSaleCard gridArea={"nomo"} h={"520px"} w={"full"} match={match} />
      </SimpleGrid>

      {!import.meta.env.PROD && (
        <Button disabled={isDisconnected} onClick={nextMatch}>
          {isDisconnected ? "Connect to start next match" : "Start next match"}
        </Button>
      )}

      <PreviousNomos />
    </VStack>
  );
};
