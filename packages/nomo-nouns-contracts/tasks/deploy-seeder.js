const { task } = require("hardhat/config");

task("deploy-seeder", "Deploy Nomo seeder contract").setAction(
  async ({}, { ethers, network }) => {
    const SeederContract = await ethers.getContractFactory("NomoNounsSeeder");
    const seederContract = await SeederContract.deploy({
      gasLimit: 3000000,
      gasPrice: 9000000000,
    });

    await seederContract.deployed();

    //Uncomment for Etherscan verification
    //await hre.run("verify:verify", {
    // address: seederContract.address,
    //});

    console.log("Seeder contract deployed to: ", seederContract.address);
  }
);

