const { task } = require("hardhat/config");

task("deploy-test-auction", "Deploy test auction house contract").setAction(
  async ({}, { ethers, network }) => {
    const TestAuctionContract = await ethers.getContractFactory(
      "TestAuctionHouse"
    );
    const testAuctionContract = await TestAuctionContract.deploy({
      gasLimit: 3000000,
    });

    await testAuctionContract.deployed();

    console.log(
      "Test Auction house contract deployed to: ",
      testAuctionContract.address
    );
  }
);
