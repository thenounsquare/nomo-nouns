import { FinishedMatch, getMintPrice, SellingMatch } from "../../common/match";
import { FC, useState } from "react";
import { useQuery } from "react-query";
import { useTimestamp } from "../hooks/useTimestamp";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "ethers/lib/utils";
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
} from "@chakra-ui/react";
import { NomoCard } from "../NomoCard";
import { PreviousNomos } from "./PreviousNomos";
import { formatCountdown } from "../utils/formatCountdown";
import { useMintNomo, useStartNextMatch } from "../hooks/match";
import { BigNumber } from "ethers";

export type SellingPhaseProps = {
  match: SellingMatch | FinishedMatch;
};

export const SellingPhase: FC<SellingPhaseProps> = ({ match }) => {
  const [isMinting, setIsMinting] = useState(false);
  const { data: ethPrice, isSuccess: ethPriceAvailable } = useQuery(
    "ethPrice",
    () =>
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      )
        .then((r) => r.json())
        .then((r) => r.ethereum.usd),
    { staleTime: 15 * 60_000 }
  );
  const now = useTimestamp();
  const { isDisconnected, address } = useAccount();
  const saleOver = match.status === "Finished";
  const timeElapsedFromStart = now - match.startTime;
  const secondsToNextPriceIncrease =
    now < match.startTime
      ? match.startTime - now + match.mintingIncreaseInterval
      : match.mintingIncreaseInterval -
        (timeElapsedFromStart % match.mintingIncreaseInterval);
  const priceIncreaseCountdown = formatCountdown(secondsToNextPriceIncrease);

  const { data: balance } = useBalance({ addressOrName: address });
  const [mintQuantity, setMintQuantity] = useState(1);
  const nextMatch = useStartNextMatch();
  const { canMint, mintNomo } = useMintNomo(match);
  const mintPrice = getMintPrice(now, match);
  const totalCost = mintPrice.mul(mintQuantity);
  const totalCostString = formatEther(totalCost);
  const hasFundsToMint = !balance || balance.value.gte(totalCost);
  const onMint =
    mintNomo === undefined
      ? undefined
      : () => {
          setIsMinting(true);
          mintNomo(mintQuantity).finally(() => setIsMinting(false));
        };

  // @ts-ignore
  return (
    <VStack h={"full"} spacing={[6, 10]} w={"full"}>
      <VStack spacing={0}>
        <Text fontSize={["md", "xl"]}>
          {saleOver
            ? `The sale for Nomo Noun #${match.nounId} is over`
            : `Mint Nomo Noun #${match.nounId}!`}
        </Text>
        <Text fontSize={["xs", "md"]}>
          {saleOver
            ? `The match for Nomo Noun #${match.nounId + 1} starts soon 👀`
            : `The sooner you mint, the cheaper it is!`}
        </Text>
      </VStack>

      <VStack
        alignItems={["center", "start"]}
        spacing={0}
        lineHeight={"normal"}
      >
        <Text fontSize={"lg"} fontWeight={"bold"}>
          Nomo Noun #{match.nounId}
        </Text>
        <Text fontSize={"sm"}>
          Born {new Date(match.matchEnd * 1000).toDateString()}
        </Text>
        <Stack
          direction={["column", "row"]}
          alignItems={["center", "start"]}
          spacing={[2, 6]}
        >
          <NomoCard
            w={["192px", "320px"]}
            nounId={match.nounId}
            tally={match.electedNomoTally}
            match={match}
          />
          <VStack>
            <VStack
              w={["xs", "sm"]}
              borderWidth={1}
              borderRadius={"md"}
              spacing={0}
            >
              <HStack p={4} w={"full"} justifyContent={"space-between"}>
                <Stat textAlign={saleOver ? "center" : undefined}>
                  <StatLabel>
                    {saleOver ? "Last price" : "Current Price"}
                  </StatLabel>
                  <StatNumber>{formatEther(mintPrice)} ETH</StatNumber>
                  <StatHelpText mb={0}>
                    {ethPriceAvailable ? (
                      `${getUsdPrice(mintPrice, ethPrice)} USD`
                    ) : (
                      <Spinner />
                    )}
                  </StatHelpText>
                </Stat>
                {!saleOver && (
                  <Stat textAlign={"end"}>
                    <StatLabel>Price in {priceIncreaseCountdown}</StatLabel>
                    <StatNumber>
                      {formatEther(
                        mintPrice.add(match.mintingPriceIncreasePerInterval)
                      )}{" "}
                      ETH
                    </StatNumber>
                    <StatHelpText mb={0}>
                      {ethPriceAvailable ? (
                        `${getUsdPrice(
                          mintPrice.add(match.mintingPriceIncreasePerInterval),
                          ethPrice
                        )} USD`
                      ) : (
                        <Spinner />
                      )}
                    </StatHelpText>
                  </Stat>
                )}
              </HStack>
              <HStack w={"full"} spacing={0}>
                <Button
                  disabled={
                    isDisconnected ||
                    !hasFundsToMint ||
                    !canMint ||
                    isMinting ||
                    saleOver
                  }
                  isLoading={isMinting}
                  loadingText={`Minting ${mintQuantity}`}
                  onClick={onMint}
                  borderRadius={0}
                  w={"full"}
                >
                  {saleOver
                    ? "Sale over"
                    : isDisconnected
                    ? "Connect to mint"
                    : !hasFundsToMint
                    ? `Wallet does not have ${totalCostString}ETH`
                    : `Mint ${mintQuantity} now for ${totalCostString}ETH`}
                </Button>
                {!saleOver && (
                  <NumberInput
                    // @ts-ignore
                    disabled={isMinting}
                    value={mintQuantity}
                    onChange={(_, valueAsNumber) => {
                      if (!valueAsNumber || !(valueAsNumber > 0)) {
                        setMintQuantity(1);
                      } else {
                        setMintQuantity(valueAsNumber);
                      }
                    }}
                    min={1}
                  >
                    <NumberInputField
                      w={20}
                      borderLeftRadius={0}
                      borderTopRadius={0}
                      borderRightWidth={0}
                      borderBottomWidth={0}
                    />
                    <NumberInputStepper borderTopRadius={0}>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              </HStack>
            </VStack>
          </VStack>
        </Stack>
      </VStack>

      {!import.meta.env.PROD && (
        <Button disabled={isDisconnected} onClick={nextMatch}>
          {isDisconnected ? "Connect to start next match" : "Start next match"}
        </Button>
      )}

      <PreviousNomos />
    </VStack>
  );
};

const getUsdPrice = (mintPrice: BigNumber, ethUsdPrice: number) =>
  (
    (mintPrice.div(1_000_000_000).toNumber() * ethUsdPrice) /
    1_000_000_000
  ).toFixed(2);
