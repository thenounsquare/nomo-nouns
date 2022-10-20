const { task } = require("hardhat/config");

task("deploy-mock-auction", "Deploy mock auction house contract").setAction(
  async ({}, { ethers, network }) => {
    const MockAuctionContract = await ethers.getContractFactory(
      "MockAuctionHouse"
    );
    const mockAuctionContract = await MockAuctionContract.deploy({
      gasLimit: 3000000,
    });

    await mockAuctionContract.deployed();

    console.log(
      "Mock Auction house contract deployed to: ",
      mockAuctionContract.address
    );
  }
);
