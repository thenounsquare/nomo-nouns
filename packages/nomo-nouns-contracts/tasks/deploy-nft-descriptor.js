const { task, types } = require("hardhat/config");

task("deploy-nft-descriptor", "Deploy Nomo NFT descriptor library").setAction(
  async ({ art, nftDescriptor, renderer }, { ethers }) => {
    const DescriptorContract = await ethers.getContractFactory(
      "NomoNFTDescriptor"
    );
    const descriptorContract = await DescriptorContract.deploy({
      gasLimit: 3000000,
      gasPrice: 9000000000,
      //nonce: 0,
    });

    await descriptorContract.deployed();

    // Uncomment for Etherscan verification
    //await hre.run("verify:verify", {
    //  address: descriptorContract.address,
    //});

    console.log(
      "Nomo NFT descriptor deployed to: ",
      descriptorContract.address
    );
  }
);
