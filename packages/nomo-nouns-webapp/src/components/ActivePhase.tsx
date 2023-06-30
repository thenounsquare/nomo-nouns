import { ActiveMatch, Match } from "../../common/match";
import { FC, useMemo } from "react";
import { useTimestamp } from "../hooks/useTimestamp";
import { useAccount } from "wagmi";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Grid,
  HStack,
  StackDivider,
  StackProps,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import {
  useDisqualifiedNotification,
  useVoteFor,
  useWarmupForMatch,
} from "../hooks/match";
import { useSoundtrack, useVoteSfx, useWinnerSfx } from "../hooks/sfx";
import { groupBy } from "lodash";
import { LayoutGroup } from "framer-motion";
import { NomoCard } from "../NomoCard";
import { useCountActiveUsers } from "../hooks/session";

export type ActivePhaseProps = {
  match: ActiveMatch;
};

export const ActivePhase: FC<ActivePhaseProps> = ({ match }) => {
  const now = useTimestamp();
  useWarmupForMatch(match);
  useCountActiveUsers();
  useDisqualifiedNotification(match);
  const { address } = useAccount();
  const walletDisqualified = useMemo(
    () =>
      !!address &&
      match.disqualifiedWallets &&
      match.disqualifiedWallets[address],
    [match.disqualifiedWallets, address]
  );
  const { stage, elapsedTime, currentRound } = {
    stage: match.currentStage.name,
    elapsedTime: match.currentStageTimeElapsed,
    currentRound: match.currentStage.roundNumber,
  };
  useSoundtrack(stage, elapsedTime, currentRound);
  useVoteSfx(match.tally.totalVotes);

  useWinnerSfx(match);

  // useCountdownSfx(match);
  return (
    <VStack h={"full"} w={"full"} px={[4, 24]} spacing={[2, 10]}>
      {walletDisqualified ? (
        <Alert
          borderRadius={"md"}
          status="error"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          gap={6}
        >
          <HStack>
            <AlertIcon boxSize="24px" mr={0} />
            <AlertTitle>Uh-oh...you're disqualified!</AlertTitle>
          </HStack>
          <AlertDescription>
            Seems like you did some superhuman clicking there, homie 🤖 This
            match, you'll vote No'Mo'
          </AlertDescription>
        </Alert>
      ) : (
        <Text textAlign={"center"} fontSize={["xs", "md"]}>
          {match.currentStage.name === "Celebration"
            ? "Match finished. Here's your new NOMO!"
            : "Hit your favourite Nouns as many times as you can before they\n" +
              "          disappear!"}
        </Text>
      )}
      {<Countdown match={match} now={now} />}
      <CandidatesGrid match={match} w={"full"} />
    </VStack>
  );
};

export type CandidatesGridProps = {
  match: Match;
} & StackProps;

export const CandidatesGrid: FC<CandidatesGridProps> = ({
  match,
  ...props
}) => {
  const { address } = useAccount();
  const walletDisqualified =
    !!address &&
    match.disqualifiedWallets &&
    match.disqualifiedWallets[address];
  const voteFor = useVoteFor();

  const { true: eliminatedCandidates, false: activeCandidates } = groupBy(
    match.tally.blocks,
    "eliminated"
  );

  const activeCandidatesWidth =
    activeCandidates.length > 4
      ? useBreakpointValue(["64px", "96px"])
      : activeCandidates.length > 2
      ? useBreakpointValue(["96px", "160px"])
      : useBreakpointValue(["160px", "320px"]);
      const eliminatedCandidatesWidth = useBreakpointValue(["64px", "96px"]);

  return (
    <LayoutGroup>
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={[2, 10]}
        {...props}
      >
        <Grid
          w={"full"}
          rowGap={[2, 4]}
          columnGap={2}
          templateColumns={`repeat(auto-fit,${activeCandidatesWidth})`}
          justifyContent={"space-evenly"}
        >
          {activeCandidates.map((tally) => (
            <NomoCard
              walletDisqualified={walletDisqualified}
              key={tally.block.number}
              tally={tally}
              match={match}
              w={activeCandidatesWidth}
              nounId={match.nounId}
              onVote={
                match.status === "Active" && address
                  ? () => voteFor(address, tally.block.number)
                  : undefined
              }
            />
          ))}
        </Grid>
        {eliminatedCandidates && (
          <Grid
            w={"full"}
            rowGap={[2, 4]}
            columnGap={2}
            templateColumns={`repeat(auto-fit,${eliminatedCandidatesWidth})`}
            justifyContent={"space-evenly"}
          >
            {eliminatedCandidates.map((tally) => (
              <NomoCard
                key={tally.block.number}
                tally={tally}
                match={match}
                w={eliminatedCandidatesWidth}
                nounId={match.nounId}
              />
            ))}
          </Grid>
        )}
      </VStack>
    </LayoutGroup>
  );
};

export const Countdown = ({ match }: { match: ActiveMatch; now: number }) => {
  const currentStage = match.currentStage;

  if (currentStage.name === "Celebration") {
    return <></>;
  }

  if (currentStage.name === "Warmup") {
    return (
      <>
        <Text>Match starts in:</Text>
        <Text fontSize={"lg"}>{`${match.currentStageTimeLeft}s`}</Text>
      </>
    );
  }

  if (currentStage.name === "Interlude") {
    return (
      <>
        <Text>Get ready! Final Mash starts in:</Text>
        <Text fontSize={"lg"}>{`${match.currentStageTimeLeft}s`}</Text>
      </>
    );
  }

  return (
    <>
      <Text fontSize={"lg"}>
        {`Round ${currentStage.roundNumber}/${match.amountRounds}`}
      </Text>
      <Text>{`Time left: ${match.currentStageTimeLeft}s`}</Text>
    </>
  );
};
