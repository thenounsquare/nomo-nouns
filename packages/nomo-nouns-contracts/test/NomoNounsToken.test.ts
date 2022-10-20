import {
  MockAuctionHouse,
  MockDescriptor,
  NomoNounsSeeder,
  NomoNounsToken,
} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NOMO NOUNS Token Testing", async () => {
  let nomoNouns: NomoNounsToken;
  let nomoNounsSeeder: NomoNounsSeeder;
  let mockAuctionHouse: MockAuctionHouse;
  let mockDescriptor: MockDescriptor;
  let owner: SignerWithAddress;
  let nonOwner: SignerWithAddress;

  let nounId = 50;
  let startTime = Math.floor(Date.now() / 1000);
  let endTime = startTime + 60;
  let settled = false;
  let blockNumber = 10_000;

  let domain = {
    name: "NOMONOUNS",
    version: "1",
    chainId: 31337,
    verifyingContract: "",
  };

  let types = {
    Minter: [
      { name: "nounsId", type: "uint256" },
      { name: "blockNumber", type: "uint256" },
    ],
  };

  beforeEach(async () => {
    [owner, nonOwner] = await ethers.getSigners();
    const MockAuctionHouse = await ethers.getContractFactory(
      "MockAuctionHouse"
    );
    mockAuctionHouse = await MockAuctionHouse.deploy();

    const MockDescriptor = await ethers.getContractFactory("MockDescriptor");
    mockDescriptor = await MockDescriptor.deploy();

    const NomoNounsSeeder = await ethers.getContractFactory("NomoNounsSeeder");
    nomoNounsSeeder = await NomoNounsSeeder.deploy();

    const NomoNouns = await ethers.getContractFactory("NomoNounsToken");
    nomoNouns = await NomoNouns.deploy(
      "10000000000000000",
      60 * 15,
      2500000000000000,
      owner.address,
      owner.address,
      mockAuctionHouse.address,
      nomoNounsSeeder.address,
      mockDescriptor.address
    );

    domain.verifyingContract = nomoNouns.address;

    // prepare Auction House
    await mockAuctionHouse.createAuction(nounId, startTime, endTime, settled);
  });

  describe("Deployment", async () => {
    it("should deploy", async function () {
      expect(nomoNounsSeeder.address).to.not.equal("");
      expect(nomoNouns.address).to.not.equal("");
      expect(mockDescriptor.address).to.not.equal("");
      expect(mockAuctionHouse.address).to.not.equal("");
    });
  });

  describe("Testing ERC1155 functionality", async () => {
    it("should set contract URI", async () => {
      await nomoNouns.setContractURIHash("ipfs://qm6yUiaiak");

      expect(await nomoNouns.contractURI()).to.eq("ipfs://qm6yUiaiak");
    });

    it("should set Descriptor", async () => {
      await nomoNouns.setDescriptor(mockDescriptor.address);

      expect(await nomoNouns.descriptor()).to.eq(mockDescriptor.address);
    });

    it("should set Seeder", async () => {
      await nomoNouns.setSeeder(nomoNounsSeeder.address);

      expect(await nomoNouns.seeder()).to.eq(nomoNounsSeeder.address);
    });

    it("Auction House should", async () => {
      // await nomoNouns.setSeeder(nomoNounsSeeder.address);
      expect(await nomoNouns.auctionHouse()).to.eq(mockAuctionHouse.address);
    });

    it("Withdraw should WITHDRAW_NO_BALANCE", async () => {
      await expect(nomoNouns.withdraw()).to.be.reverted;
    });
  });

  describe("Testing Mint function", async () => {
    it("Mint: should revert with Invalid Signature", async () => {
      const signature = await nonOwner._signTypedData(domain, types, {
        nounsId: nounId,
        blockNumber: blockNumber,
      });

      await expect(
        nomoNouns.mint(nounId, blockNumber, 1, signature)
      ).to.be.revertedWith("Invalid signature");
    });

    it("Mint: should revert when Minting Expired", async () => {
      const signature = await owner._signTypedData(domain, types, {
        nounsId: nounId,
        blockNumber: blockNumber,
      });

      // change endTime
      await mockAuctionHouse.createAuction(nounId, startTime, 10, settled);

      await expect(
        nomoNouns.mint(nounId, blockNumber, 1, signature)
      ).to.be.revertedWith("Minting expired");
    });

    it("Mint: should revert with invalid NounId", async () => {
      const signature = await owner._signTypedData(domain, types, {
        nounsId: 9999,
        blockNumber: blockNumber,
      });

      // change endTime
      await mockAuctionHouse.createAuction(
        50,
        startTime,
        endTime + 10000,
        settled
      );

      await expect(
        nomoNouns.mint(9999, blockNumber, 1, signature)
      ).to.be.revertedWith("NounId invalid");
    });

    it("Mint: should revert with Not enough ETH to pay", async () => {
      const signature = await owner._signTypedData(domain, types, {
        nounsId: nounId,
        blockNumber: blockNumber,
      });

      // change endTime
      await mockAuctionHouse.createAuction(
        50,
        startTime,
        endTime + 10000,
        settled
      );

      await expect(
        nomoNouns.mint(nounId, blockNumber, 1, signature, { value: 0 })
      ).to.be.revertedWith("Not enough ETH to pay");
    });

    it("Mint: it should mint a single token", async () => {
      const signature = await owner._signTypedData(domain, types, {
        nounsId: nounId,
        blockNumber: blockNumber,
      });

      // change endTime
      await mockAuctionHouse.createAuction(
        50,
        startTime,
        endTime + 10000,
        settled
      );

      await expect(
        nomoNouns.mint(nounId, blockNumber, 1, signature, {
          value: ethers.utils.parseUnits((20).toString(), "ether"),
        })
      ).not.to.be.reverted;

      expect(await nomoNouns.balanceOf(owner.address)).to.eq(
        ethers.BigNumber.from("1")
      );
    });

    it("Mint: it should mint 5 tokens", async () => {
      await mockAuctionHouse.createAuction(nounId, startTime, endTime, settled);

      const signature = await owner._signTypedData(domain, types, {
        nounsId: nounId,
        blockNumber: blockNumber,
      });

      // change endTime
      await mockAuctionHouse.createAuction(
        50,
        startTime,
        endTime + 10000,
        settled
      );

      await expect(
        nomoNouns.mint(nounId, blockNumber, 5, signature, {
          value: ethers.utils.parseUnits((20).toString(), "ether"),
        })
      ).not.to.be.reverted;

      expect(await nomoNouns.balanceOf(owner.address)).to.eq(
        ethers.BigNumber.from("5")
      );
    });

    it("Mint: it should use the auction nounId for all tokens minted", async () => {
      await mockAuctionHouse.createAuction(nounId, startTime, endTime, settled);

      const signature = await owner._signTypedData(domain, types, {
        nounsId: nounId,
        blockNumber: blockNumber,
      });

      // change endTime
      await mockAuctionHouse.createAuction(
        50,
        startTime,
        endTime + 10000,
        settled
      );

      await expect(
        nomoNouns.mint(nounId, blockNumber, 500, signature, {
          value: ethers.utils.parseUnits((20).toString(), "ether"),
        })
      ).not.to.be.reverted;
      await expect(
        nomoNouns.mint(nounId, blockNumber, 1, signature, {
          value: ethers.utils.parseUnits((20).toString(), "ether"),
        })
      ).not.to.be.reverted;

      expect(await nomoNouns.getNounId("1")).to.eq("50");
      expect(await nomoNouns.getNounId("500")).to.eq("50");
      expect(await nomoNouns.getNounId("501")).to.eq("50");
    });
  });

  describe("Withdraw function", async () => {
    it("Withdraw : smart contract should 0 balance", async () => {
      const signature = await owner._signTypedData(domain, types, {
        nounsId: nounId,
        blockNumber: blockNumber,
      });

      // change endTime
      await mockAuctionHouse.createAuction(
        50,
        startTime,
        endTime + 10000,
        settled
      );

      await nomoNouns.mint(nounId, blockNumber, 1, signature, {
        value: ethers.utils.parseUnits((20).toString(), "ether"),
      });

      await nomoNouns.withdraw();

      let balance = await ethers.provider.getBalance(nomoNouns.address);
      expect(balance).to.eq(ethers.BigNumber.from("0"));
    });
  });
});
