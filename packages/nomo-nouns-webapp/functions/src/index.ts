import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { env } from "node:process";
import { ethers } from "ethers";
import { range } from "lodash";
import { getMatch, MatchData } from "../../common/match";
import { Provider } from "@ethersproject/providers";
import {
  // getGoerliSdk,
  getMainnetSdk,
  getOptimisticGoerliSdk,
} from "nomo-nouns-contract-sdks";
import { increment } from "firebase/database";
// import { Bytes, BigNumber } from "ethers";

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
    { name: "blocknumberHash", type: "bytes32" },
    { name: "auctionStartTimestamp", type: "uint256" },
    { name: "auctionEndTimestamp", type: "uint256" },
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
  .runWith({ memory: "512MB", secrets: ["JSON_RPC_URL", "OPTIMISM_GOERLI_RPC_URL"] })
  .https.onRequest(async (req, resp) => {
    const {
      event: {
        activity: [{ blockNum }],
      },
    } = req.body as AuctionPayload;
    const settlementBlockNumber = parseInt(blockNum);
    const optimismProvider = new ethers.providers.AlchemyProvider(
      "optimism-goerli",
      env.OPTIMISM_GOERLI_RPC_URL!
    );
    const provider = new ethers.providers.JsonRpcBatchProvider(
       env.JSON_RPC_URL!,
      // env.MAINNET_RPC_URL!,
      // Uncomment to use conditional logic for mainnet vs goerli
      // ethers.providers.getNetwork(env.CHAIN_ID === "1" ? "mainnet" : "goerli")
      ethers.providers.getNetwork("mainnet")
    );
    // Uncomment to use conditional logic for mainnet vs goerli
    // const { auctionHouse } =
    //   env.CHAIN_ID === "1" ? getMainnetSdk(provider) : getGoerliSdk(provider);
    const { auctionHouse } = getMainnetSdk(provider);
    console.log(
      "settlementBlockNumber",
      settlementBlockNumber,
      "auctionHouse.address",
      auctionHouse.address
    );

    try {
      const [nounId, startTime, endTime] = await auctionHouse.auction({
        blockTag: settlementBlockNumber,
      });
      console.log("nounId, startTime, endTime", nounId, startTime, endTime);
      const currentAuction = {
        nounId: nounId.toNumber(),
        startTime: startTime.toNumber(),
        endTime: endTime.toNumber(),
      };

      const currentMatch = await database
        .ref("currentMatch")
        .get()
        .then((s) => s.val());

      console.log("After Current Match");

      if (
        currentMatch === null ||
        currentAuction.nounId !== currentMatch.nounId
      ) {
        await startNewMatch(
          currentMatch,
          currentAuction,
          settlementBlockNumber,
          optimismProvider
        );

        console.log(
          "settlementBlockNumber",
          settlementBlockNumber,
          "currentAuction",
          currentAuction.nounId
        );
      } else {
        await extendCurrentMatch(currentAuction);
      }

      resp.sendStatus(200);
    } catch (error) {
      console.error("onAuctionCreatedError", error);
      resp.sendStatus(500);
    }
  });

const startNewMatch = async (
  prevMatch: MatchData | null,
  currentAuction: AuctionData,
  settlementBlockNumber: number,
  provider: Provider
) => {
  const mainnetProvider = new ethers.providers.JsonRpcBatchProvider(
    env.MAINNET_RPC_URL!,
    ethers.providers.getNetwork("mainnet")
  );
  const optimismProvider = new ethers.providers.AlchemyProvider(
    "optimism-goerli",
    env.OPTIMISM_GOERLI_RPC_URL!
  );
  const { auctionHouse } = getMainnetSdk(mainnetProvider);
  // env.CHAIN_ID === "1" ? getMainnetSdk(provider) : getGoerliSdk(provider);
  // will need to change these conditions here| 420 chain id of optimism goerli | 10 chain id of optimism mainnet
  const { nomoToken, nomoSeeder } = getOptimisticGoerliSdk(optimismProvider);
  // env.CHAIN_ID === "420"
  //   ? getOptimisticGoerliSdk(optimismProvider)
  //   : getGoerliSdk(provider);

  console.log("startNewMatchnomoToken", nomoToken.address);
  console.log("startNewMatchauctionHouse", auctionHouse.address);

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
        mainnetProvider.getBlock(blockNumber).then((block) => ({
          number: blockNumber,
          hash: block.hash,
          timestamp: block.timestamp,
        })),
        nomoSeeder.generateSeed(
          currentAuction.nounId,
          mainnetProvider.getBlock(blockNumber).then((block) => block.hash),
          env.NOMO_DESCRIPTOR_ADDRESS!
        ),
      ]).then(([block, { accessory, background, body, glasses, head }]) => ({
        ...block,
        seed: { accessory, background, body, glasses, head },
      }))
    )
  );
  console.log("preSettlementBlocks", preSettlementBlocks);
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
  .https.onCall(
    async ({
      nounId,
      blocknumberHash,
      auctionStartTimestamp,
      auctionEndTimestamp,
    }) => {
      const matchData = await database
        .ref("currentMatch")
        .get()
        .then((m) => m.val());
      const match = getMatch(matchData);
      // conditionally check depending on node environment
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.JSON_RPC_URL!,
        ethers.providers.getNetwork("mainnet")
      );

      // const mainnetProvider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL!);
      // const goerliMainnetProvider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL!);

      if (match.status !== "Selling") {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Nomo sale is not open"
        );
      }
      const {
        nounId: matchNounId,
        electedNomoTally: {
          block: {
            number: electedBlockNumber,
            //  hash: electedBlockHash
          },
        },
      } = match;
      // get ethereum mainnet blockhash on production, else get ethereum goerli blockhash for development
      // this line will need to use different providers based on node environment
      const electedBlockHash = await provider
        .getBlock(electedBlockNumber)
        .then((block) => (blocknumberHash = block.hash));
      if (nounId !== matchNounId || blocknumberHash !== electedBlockHash) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "This is not the elected Nomo",
          { nounId, matchNounId, blocknumberHash, electedBlockNumber }
        );
      }

      // signing EIP-712
      const signer = new ethers.Wallet(env.SIGNER_PRIVATE_KEY!);

      console.log(signer.address);
      console.log("electedBlockHash", electedBlockHash);
      console.log("domain", domain);
      console.log("types", types);
      console.log("nounId", nounId);
      console.log("blocknumberHash", blocknumberHash);
      console.log("auctionStartTimestamp", auctionStartTimestamp);
      console.log("auctionEndTimestamp", auctionEndTimestamp);
      return signer._signTypedData(domain, types, {
        nounsId: nounId,
        blocknumberHash: blocknumberHash,
        auctionStartTimestamp: auctionStartTimestamp,
        auctionEndTimestamp: auctionEndTimestamp,
      });
    }
  );

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
