const { task, types } = require("hardhat/config");

task("deploy-descriptor", "Deploy Nomo descriptor contract")
  .addOptionalParam(
    "art",
    "The Art contract address",
    "0x17050F185DB70920B7c9DE92D084597a25F6e0A3",
    types.string
  )
  .addOptionalParam(
    "renderer",
    "The Renderer contract address",
    "0x1A8B9AaC8FaBC93D2574f9Ae0927e19B009c69f8",
    types.string
  )
  .addOptionalParam(
    "nomoToken",
    "The Nomo Token contract address",
    "0x1464eBBf9ecd642d42Db8e8827919fdd4A786987",
    types.string
  )
  .addOptionalParam(
    "nftDescriptor",
    "The NFT Descriptor lib address",
    "0xB7782eb73D888A62c5a07c488A5d1452395aEd02",
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

      // Uncomment for Etherscan verification
      // await hre.run("verify:verify", {
      //   address: descriptorContract.address,
      //   constructorArguments: [
      //     art,
      //     renderer,
      //     nomoToken
      //   ],
      // });

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
