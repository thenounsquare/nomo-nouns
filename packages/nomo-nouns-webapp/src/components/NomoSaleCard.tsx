import { NomoCard } from "../NomoCard";
import {
  Button,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  StackProps,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  VStack,
} from "@chakra-ui/react";
import { formatEther } from "ethers/lib/utils";
import { FC, useState } from "react";
import { FinishedMatch, getMintPrice, SellingMatch } from "../../common/match";
import { BigNumber } from "ethers";
import { useQuery } from "react-query";
import { useTimestamp } from "../hooks/useTimestamp";
import { useAccount, useBalance } from "wagmi";
import { formatCountdown } from "../utils/formatCountdown";
import { useMintNomo, useStartNextMatch } from "../hooks/match";

export type NomoSaleCardProps = {
  match: SellingMatch | FinishedMatch;
} & StackProps;

export const NomoSaleCard: FC<NomoSaleCardProps> = ({ match, ...props }) => {
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
  const timeElapsedFromStart = now - match.startTime;
  const secondsToNextPriceIncrease =
    now < match.startTime
      ? match.startTime - now + match.mintingIncreaseInterval
      : match.mintingIncreaseInterval -
        (timeElapsedFromStart % match.mintingIncreaseInterval);
  const priceIncreaseCountdown = formatCountdown(secondsToNextPriceIncrease);

  const { data: balance } = useBalance({ addressOrName: address });
  const [mintQuantity, setMintQuantity] = useState(1);
  const { canMint, mintNomo } = useMintNomo(match);
  const onMint =
    mintNomo === undefined
      ? undefined
      : () => {
          setIsMinting(true);
          mintNomo?.(mintQuantity).finally(() => setIsMinting(false));
        };
  const isStaticPrice = BigNumber.from(match.mintingPriceIncreasePerInterval).eq(0)
  const mintPrice = getMintPrice(now, match);
  const totalCost = mintPrice.mul(mintQuantity);
  const totalCostString = formatEther(totalCost);
  const hasFundsToMint = !balance || balance.value.gte(totalCost);
  const saleOver = match.status === "Finished";
  // console.log({
  //       isDisconnected ,
  //     hasFundsToMint ,
  //     canMint ,
  //     isMinting ,
  //     saleOver
  // })
  return (
    <VStack alignItems={"center"} spacing={0} {...props}>
      <NomoCard
        w={"full"}
        nounId={match.nounId}
        tally={match.electedNomoTally}
        match={match}
        mb={0}
        borderWidth={1}
        borderBottomWidth={0}
        borderBottomRadius={0}
      />
      <VStack w={"full"} p={0}>
        <VStack
          w={"full"}
          borderWidth={1}
          borderTopWidth={0}
          p={0}
          borderRadius={"md"}
          spacing={0}
        >
          <HStack p={4} w={"full"} justifyContent={"space-between"}>
            <Stat textAlign={isStaticPrice || saleOver ? "center" : undefined} w={10}>
              <StatLabel>{isStaticPrice ? "Price" : saleOver ? "Last price" : "Current Price"}</StatLabel>
              <StatNumber>{formatEther(mintPrice)} ETH</StatNumber>
              <StatHelpText mb={0}>
                {ethPriceAvailable ? (
                  `${getUsdPrice(mintPrice, ethPrice)} USD`
                ) : (
                  <Spinner />
                )}
              </StatHelpText>
            </Stat>
            {!isStaticPrice && !saleOver && (
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
    </VStack>
  );
};

const getUsdPrice = (mintPrice: BigNumber, ethUsdPrice: number) =>
  (
    (mintPrice.div(1_000_000_000).toNumber() * ethUsdPrice) /
    1_000_000_000
  ).toFixed(2);
