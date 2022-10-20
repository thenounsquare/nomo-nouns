const { task, types } = require("hardhat/config");

task("deploy-descriptor", "Deploy Nomo descriptor contract")
  .addOptionalParam(
    "art",
    "The Art contract address",
    "0x48A7C62e2560d1336869D6550841222942768C49",
    types.string
  )
  .addOptionalParam(
    "renderer",
    "The Renderer contract address",
    "0x81d94554A4b072BFcd850205f0c79e97c92aab56",
    types.string
  )
  .addOptionalParam(
    "nomoToken",
    "The Nomo Token contract address",
    "0xbe37CC3F8f7E1E4C264Ba5818482fA75e2D1823e",
    types.string
  )
  .addOptionalParam(
    "nftDescriptor",
    "The NFT Descriptor lib address",
    "0xbE648AB1E28df343D7F6B71897e1a96BE08cDbE6",
    types.string
  )
  .setAction(
    async ({ art, renderer, nomoToken, nftDescriptor }, { ethers }) => {
      const DescriptorContract = await ethers.getContractFactory(
        "NomoNounsDescriptorV2",
        {
          libraries: { NomoNFTDescriptor: nftDescriptor },
        }
      );
      const descriptorContract = await DescriptorContract.deploy(
        art,
        renderer,
        nomoToken
      );

      await descriptorContract.deployed();

      console.log("Nomo descriptor deployed to: ", descriptorContract.address);

      await descriptorContract.setBackgroundOverride(0, "ff3260", {
        gasPrice: 10000000000,
      });
      await descriptorContract.setBackgroundOverride(1, "fccb09", {
        gasPrice: 10000000000,
      });

      console.log("Background overrides set");

      console.log(
        "Verification params:\n",
        descriptorContract.address,
        art,
        renderer,
        nomoToken
      );
    }
  );
