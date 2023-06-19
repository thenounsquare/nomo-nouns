import { orderBy, times } from "lodash";
import { BigNumber } from "ethers";
import { NounSeed } from "@nouns/assets/dist/types";

export const MAX_CLICKS_PER_SECOND = 16;

export type Block = {
  number: number;
  seed: NounSeed;
  hash: string;
};

export type VoteCount = {
  [key: string]: number;
};

export type BlockTally = {
  block: Block;
  roundVotes: number;
  totalVotes: number;
  eliminated: boolean;
  dueForElimination: boolean;
};

export type Tally = { totalVotes: number; blocks: BlockTally[] };

export type MatchStatus = "Active" | "Selling" | "Finished";

export type MatchData = {
  nounId: number;
  startTime: number;
  endTime: number;
  mintingIncreaseInterval: number;
  mintingStartPrice: string;
  mintingPriceIncreasePerInterval: string;
  candidateBlocks: Block[];
  votesPerWallet: {
    [userWallet: string]: VoteCount;
  };
  disqualifiedWallets: { [userWallet: string]: boolean };
  votesPerRound: {
    [roundNumber: number]: VoteCount;
  };
};

export interface BaseMatch extends MatchData {
  status: MatchStatus;
  matchEnd: number;
}

export interface ActiveMatch extends BaseMatch {
  status: "Active";
  amountRounds: number;
  currentStage: Stage;
  currentStageTimeElapsed: number;
  maxVotesPerWallet: number;
  currentStageTimeLeft: number;
  tally: Tally;
}

export interface SellingMatch extends BaseMatch {
  status: "Selling";
  electedNomoTally: BlockTally;
  tally: Tally;
}

export interface FinishedMatch extends BaseMatch {
  status: "Finished";
  electedNomoTally: BlockTally;
  tally: Tally;
}

export type Match = ActiveMatch | SellingMatch | FinishedMatch;

export type StageName =
  | "Warmup"
  | "Round"
  | "Interlude"
  | "Final Mash"
  | "Celebration";

export type Stage = {
  name: StageName;
  roundNumber: number;
  votingEnabled: boolean;
  duration: number;
};

export const getMatch = (matchData: MatchData): Match => {
  const amountCandidates = matchData.candidateBlocks.length;

  const amountRounds = Math.ceil(Math.log2(amountCandidates));

  const timeline: Stage[] = [
    {
      name: "Warmup",
      roundNumber: 0,
      votingEnabled: false,
      duration: 60,
    },
    ...times<Stage>(amountRounds - 1, (i) => ({
      name: "Round",
      roundNumber: i + 1,
      votingEnabled: true,
      duration: 15,
    })),
    {
      name: "Interlude",
      roundNumber: amountRounds,
      votingEnabled: false,
      duration: 10,
    },
    {
      name: `Final Mash`,
      roundNumber: amountRounds,
      votingEnabled: true,
      duration: 15,
    },
    {
      name: `Celebration`,
      roundNumber: amountRounds + 1,
      votingEnabled: false,
      duration: 10,
    },
  ];

  const currentTimestamp = Math.round(Date.now() / 1000);
  const timeElapsed = currentTimestamp - matchData.startTime;
  const { currentStage, pastStagesDuration, cumulativeVotingTime } =
    getCurrentStage(timeElapsed, timeline);

  const matchDuration = timeline.reduce(
    (sum, stage) => sum + stage.duration,
    0
  );

  const currentStageStart = matchData.startTime + pastStagesDuration;
  const currentStageTimeElapsed = currentTimestamp - currentStageStart;

  const matchEnd = matchData.startTime + matchDuration;

  if (currentTimestamp <= matchEnd) {
    return {
      ...matchData,
      status: "Active",
      amountRounds,
      currentStage,
      matchEnd,
      currentStageTimeElapsed,
      maxVotesPerWallet: MAX_CLICKS_PER_SECOND * (cumulativeVotingTime + 1),
      currentStageTimeLeft: currentStage.duration - currentStageTimeElapsed,
      tally: getTally(matchData, currentStage.roundNumber, false),
    };
  }

  const tally = getTally(matchData, amountRounds + 1, true);
  const electedNomoTally = tally.blocks.filter((block) => !block.eliminated)[0];

  return {
    ...matchData,
    matchEnd,
    tally,
    electedNomoTally,
    status: currentTimestamp < matchData.endTime ? "Selling" : "Finished",
  };
};

const getTally = (
  matchData: MatchData,
  currentRound: number,
  matchFinished: boolean
): Tally => {
  let activeBlocks = matchData.candidateBlocks.map((block) => block.number);
  let eliminatedBlocks = [] as number[];
  let blocksDueForElimination = [] as number[];

  let blockRoundVotes = {} as { [blockNumber: number]: number };
  let blockTotalVotes = {} as { [blockNumber: number]: number };
  let totalVotes = 0;

  for (let round = 1; round <= currentRound; round++) {
    blockRoundVotes = {};
    eliminatedBlocks = [...eliminatedBlocks, ...blocksDueForElimination];
    activeBlocks = activeBlocks.filter(
      (number) => !eliminatedBlocks.includes(number)
    );

    const currentRoundVotes = (matchData.votesPerRound ?? {})[round] ?? {};
    for (const blockNumber of activeBlocks) {
      blockRoundVotes[blockNumber] = currentRoundVotes[blockNumber] ?? 0;
      blockTotalVotes[blockNumber] =
        (blockTotalVotes[blockNumber] ?? 0) +
        (currentRoundVotes[blockNumber] ?? 0);
      totalVotes += blockRoundVotes[blockNumber];
    }

    const currentRoundTally = activeBlocks.map((number) => ({
      number,
      votes: currentRoundVotes[number] ?? 0,
    }));

    const sortedRoundTally = orderBy(
      currentRoundTally,
      ["votes", "number"],
      ["asc", "desc"]
    );
    blocksDueForElimination = sortedRoundTally
      .slice(0, Math.floor(currentRoundTally.length / 2))
      .map((block) => block.number);
  }

  const blocksEliminationStatus: {
    [blockNumber: number]: {
      eliminated: false;
      dueForElimination: false;
      index: number;
    };
  } = {
    ...activeBlocks.reduce(
      (activeBlocksStatus, number) => ({
        ...activeBlocksStatus,
        [number]: { eliminated: false, dueForElimination: false },
      }),
      {}
    ),
    ...eliminatedBlocks.reduce(
      (eliminatedBlocksStatus, number) => ({
        ...eliminatedBlocksStatus,
        [number]: { eliminated: true, dueForElimination: false },
      }),
      {}
    ),
    ...blocksDueForElimination.reduce(
      (blocksDueForEliminationStatus, number) => ({
        ...blocksDueForEliminationStatus,
        [number]: { eliminated: false, dueForElimination: true },
      }),
      {}
    ),
  };

  const scoredBlocks = matchData.candidateBlocks.map((block) => ({
    block,
    roundVotes: matchFinished
      ? blockTotalVotes[block.number]
      : blockRoundVotes[block.number] ?? blockTotalVotes[block.number],
    totalVotes: blockTotalVotes[block.number],
    ...blocksEliminationStatus[block.number],
  }));

  return {
    totalVotes,
    blocks: scoredBlocks,
  };
};

const getCurrentStage = (timeElapsed: number, timeline: Stage[]) => {
  let pastStagesDuration = 0;
  let cumulativeVotingTime = 0;
  for (const currentStage of timeline) {
    const currentStageEnd = pastStagesDuration + currentStage.duration;
    if (timeElapsed <= currentStageEnd) {
      const currentStageElapsedTime = timeElapsed - pastStagesDuration;
      return {
        currentStage,
        pastStagesDuration,
        cumulativeVotingTime: currentStage.votingEnabled
          ? cumulativeVotingTime + currentStageElapsedTime
          : cumulativeVotingTime,
      };
    }
    if (currentStage.votingEnabled) {
      cumulativeVotingTime += currentStage.duration;
    }
    pastStagesDuration += currentStage.duration;
  }

  return {
    currentStage: timeline[timeline.length - 1],
    pastStagesDuration,
    cumulativeVotingTime,
  };
};

export const getMintPrice = (timestamp: number, match: Match) => {
  const {
    startTime,
    endTime,
    mintingIncreaseInterval,
    mintingStartPrice,
    mintingPriceIncreasePerInterval,
  } = match;
  if (timestamp < startTime) {
    return BigNumber.from(mintingStartPrice);
  }

  const increaseSteps = Math.floor(
    (Math.min(timestamp, endTime) - startTime) / mintingIncreaseInterval
  );
  return BigNumber.from(mintingPriceIncreasePerInterval)
    .mul(increaseSteps)
    .add(mintingStartPrice);
};
