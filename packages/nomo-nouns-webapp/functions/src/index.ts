import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { env } from "node:process";
import { ethers } from "ethers";
import { range } from "lodash";
import { getMatch, MatchData } from "../../common/match";
import { Provider } from "@ethersproject/providers";
import { getGoerliSdk, getMainnetSdk } from "nomo-nouns-contract-sdks";
import { increment } from "firebase/database";
import { Bytes, BigNumber } from "ethers";

admin.initializeApp();
const database = admin.database();

const MIN_AMOUNT_CANDIDATES = 30;

const domain = {
  name: env.SIGNING_DOMAIN_NAME,
  version: env.SIGNING_DOMAIN_VERSION,
  chainId: env.CHAIN_ID,
  verifyingContract: env.SIGNING_VERIFIER_ADDRESS,
};

const types = {
  Minter: [
    { name: "nounsId", type: "uint256" },
    { name: "blockHash", type: "bytes32" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
  ],
};

type AuctionPayload = {
  webhookId: string;
  id: string;
  event: {
    activity: {
      blockNum: string;
    }[];
  };
};

type AuctionData = Pick<MatchData, "nounId" | "startTime" | "endTime">;

export const onAuctionCreated = functions
  .runWith({ memory: "512MB", secrets: ["JSON_RPC_URL"] })
  .https.onRequest(async (req, resp) => {
    const {
      event: {
        activity: [{ blockNum }],
      },
    } = req.body as AuctionPayload;

    const settlementBlockNumber = parseInt(blockNum);

    const provider = new ethers.providers.JsonRpcBatchProvider(
      env.JSON_RPC_URL!,
      ethers.providers.getNetwork(env.CHAIN_ID === "1" ? "mainnet" : "goerli")
    );

    const { auctionHouse } =
      env.CHAIN_ID === "1" ? getMainnetSdk(provider) : getGoerliSdk(provider);

    const [nounId, , startTime, endTime] = await auctionHouse.auction({
      blockTag: settlementBlockNumber,
    });
    const currentAuction = {
      nounId: nounId.toNumber(),
      startTime: startTime.toNumber(),
      endTime: endTime.toNumber(),
    };

    const currentMatch = await database
      .ref("currentMatch")
      .get()
      .then((s) => s.val());

    if (
      currentMatch === null ||
      currentAuction.nounId !== currentMatch.nounId
    ) {
      await startNewMatch(
        currentMatch,
        currentAuction,
        settlementBlockNumber,
        provider
      );
    } else {
      await extendCurrentMatch(currentAuction);
    }

    resp.sendStatus(200);
  });

const startNewMatch = async (
  prevMatch: MatchData | null,
  currentAuction: AuctionData,
  settlementBlockNumber: number,
  provider: Provider
) => {
  const { auctionHouse, nomoToken, nomoSeeder } =
    env.CHAIN_ID === "1" ? getMainnetSdk(provider) : getGoerliSdk(provider);
  const [prevAuctionNounId, , prevAuctionStartTime, prevAuctionEndTime] =
    await auctionHouse.auction({
      blockTag: settlementBlockNumber - 1,
    });

  const prevAuction = {
    nounId: prevAuctionNounId.toNumber(),
    startTime: prevAuctionStartTime.toNumber(),
    endTime: prevAuctionEndTime.toNumber(),
  };

  if (prevMatch === null && currentAuction.nounId === prevAuction.nounId) {
    return; // Prevent starting the first nomo match ahead of time
  }

  const timeBetweenAuctions = currentAuction.startTime - prevAuction.endTime;
  const maxBlocksBetweenAuctions = Math.ceil(timeBetweenAuctions / 12);

  const candidateBlockNumbers = range(
    settlementBlockNumber -
      1 -
      Math.max(maxBlocksBetweenAuctions, MIN_AMOUNT_CANDIDATES),
    settlementBlockNumber - 1
  );

  const preSettlementBlocks = await Promise.all(
    candidateBlockNumbers.map((blockNumber) =>
      Promise.all([
        provider.getBlock(blockNumber).then((block) => ({
          number: blockNumber,
          hash: block.hash,
          timestamp: block.timestamp,
        })),
        nomoSeeder.generateSeed(
          currentAuction.nounId,
          blockNumber,
          env.NOMO_DESCRIPTOR_ADDRESS!
        ),
      ]).then(([block, { accessory, background, body, glasses, head }]) => ({
        ...block,
        seed: { accessory, background, body, glasses, head },
      }))
    )
  );

  const fomoBlocks = preSettlementBlocks.filter(
    (block) => block.timestamp > prevAuction.endTime
  );

  const candidateBlocks =
    fomoBlocks.length >= 30 ? fomoBlocks : preSettlementBlocks.slice(-30);

  const mintingIncreaseInterval = await nomoToken
    .mintingIncreaseInterval()
    .then((interval) => interval.toNumber());
  const mintingPriceIncreasePerInterval =
    await nomoToken.mintingPriceIncreasePerInterval();
  const mintingStartPrice = await nomoToken.mintingStartPrice();

  await database.ref("currentMatch").set({
    nounId: currentAuction.nounId,
    startTime: currentAuction.startTime,
    endTime: currentAuction.endTime,
    mintingIncreaseInterval,
    mintingPriceIncreasePerInterval,
    mintingStartPrice,
    candidateBlocks,
  });

  if (prevMatch === null) {
    return;
  }

  await database
    .ref(`previousMatches/${prevMatch.nounId}`)
    .set(getMatch(prevMatch));
};

const extendCurrentMatch = async (currentAuction: AuctionData) => {
  await database.ref("currentMatch").update({
    startTime: currentAuction.startTime,
    endTime: currentAuction.endTime,
  });
};

export const signForMint = functions
.runWith({ secrets: ["SIGNER_PRIVATE_KEY"] })
.https.onCall(async ({ nounId, blockHash, auctionStartTimestamp, auctionEndTimestamp }) => {
  const matchData = await database
  .ref("currentMatch")
  .get()
  .then((m) => m.val());
  const match = getMatch(matchData);
  const mainnetProvider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL!);

    if (match.status !== "Selling") {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Nomo sale is not open"
      );
    }

    const {
      nounId: matchNounId,
      electedNomoTally: {
        block: { number: electedBlockNumber },
      },
    } = match;
    const electedBlockHash = await mainnetProvider.getBlock(electedBlockNumber).then((block) => block.hash);
    if (nounId !== matchNounId || blockHash !== electedBlockHash) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "This is not the elected Nomo",
        { nounId, matchNounId, blockHash, electedBlockNumber }
      );
    }

    // signing EIP-712
    const signer = new ethers.Wallet(env.SIGNER_PRIVATE_KEY!, mainnetProvider);

    return signer._signTypedData(domain, types, {
      nounsId: nounId,
      blockHash: blockHash,
      startTime: auctionStartTimestamp,
      endTime: auctionEndTimestamp,
    });
  });

export const vote = functions.https.onCall(async (props) => {
  // Used for warming up some instances before the match starts
  if (!props) {
    return;
  }

  const { walletAddress, blockNumber } = props;
  const match = getMatch(
    await database
      .ref("currentMatch")
      .get()
      .then((m) => m.val())
  );
  if (match.status !== "Active" || !match.currentStage.votingEnabled) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Voting is not enabled"
    );
  }

  const totalWalletVotes = Object.values(
    (match.votesPerWallet ?? {})[walletAddress] ?? {}
  ).reduce((sum, votes) => sum + votes, 0);
  if (totalWalletVotes + 1 > match.maxVotesPerWallet) {
    return database
      .ref(`currentMatch/disqualifiedWallets/${walletAddress}`)
      .set(true);
  }

  if ((match.disqualifiedWallets ?? {})[walletAddress]) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Wallet disqualified for this match"
    );
  }

  return Promise.all([
    database
      .ref(`currentMatch/votesPerWallet/${walletAddress}/${blockNumber}`)
      .set(increment(1)),
    database
      .ref(
        `currentMatch/votesPerRound/${match.currentStage.roundNumber}/${blockNumber}`
      )
      .set(increment(1)),
  ]);
});
