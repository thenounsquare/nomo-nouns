const { task, types } = require("hardhat/config");

task("deploy-token", "Deploy Nomo token contract")
  .addOptionalParam(
    "mintingStartPrice",
    "The minting start price",
    "6900000000000000" /* 0.0069 ETH */,
    types.string
  )
  .addOptionalParam(
    "mintingIncreaseInterval",
    "The minting increase interval in seconds",
    60 * 15 /* 15 minutes */,
    types.int
  )
  .addOptionalParam(
    "mintingPriceIncreasePerInterval",
    "The minting price increase per interval in wei",
    1000000000000000 /* 0.001 ETH */,
    types.int
  )
  .addOptionalParam(
    "withdrawWallet",
    "Wallet address for withdraw the ETH  ",
    "0x7aCA8C5653834AD797d3a28bfCd6AE0072390Ea8",
    types.string
  )
  .addOptionalParam(
    "signer",
    "Signer address to sign minting",
    "0x1B578146656673402d9B3BFd4b8a3636B8EAf1fa",
    types.string
  )
  .addOptionalParam(
    "seeder",
    "The NomoNounsSeeder contract address",
    "0xD5CA8ad163a342Bb769C5157934C9F1cC2b0EFC6",
    types.string
  )
  .addOptionalParam(
    "descriptor",
    "The NomoNounsDescriptor contract address",
    "0x6d2A42F2288Bcab63277E346cbA986cBC32D81f3",
    types.string
  )

  .setAction(
    async (
      {
        mintingStartPrice,
        mintingIncreaseInterval,
        mintingPriceIncreasePerInterval,
        withdrawWallet,
        signer,
        seeder,
        descriptor,
      },
      { ethers }
    ) => {
      const [deployer] = await ethers.getSigners();

      if (!withdrawWallet) {
        withdrawWallet = deployer.address;
      }

      if (!signer) {
        signer = deployer.address;
      }

      const NomoNouns = await ethers.getContractFactory("NomoNounsToken");
      const nomoNouns = await NomoNouns.deploy(
        mintingStartPrice,
        mintingIncreaseInterval,
        mintingPriceIncreasePerInterval,
        withdrawWallet,
        signer,
        seeder,
        descriptor
      );

      await nomoNouns.deployed();

      console.log("NomoNouns contract deployed to: ", nomoNouns.address);

      // Uncomment for Etherscan verification
      // await hre.run("verify:verify", {
      //   address: nomoNouns.address,
      //   constructorArguments: [
      //     mintingStartPrice,
      //     mintingIncreaseInterval,
      //     mintingPriceIncreasePerInterval,
      //     withdrawWallet,
      //     signer,
      //     seeder,
      //     descriptor,
      //   ],
      // });
      

      console.log(
        "verification params:",
        nomoNouns.address,
        mintingStartPrice,
        mintingIncreaseInterval,
        mintingPriceIncreasePerInterval,
        withdrawWallet,
        signer,
        seeder,
        descriptor
      );
    }
  );
