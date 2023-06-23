import {
  MockDescriptor,
  NomoNounsSeeder,
  NomoNounsToken,
} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NOMO NOUNS Token Testing", async () => {
  let nomoNouns: NomoNounsToken;
  let nomoNounsSeeder: NomoNounsSeeder;
  let mockDescriptor: MockDescriptor;
  let owner: SignerWithAddress;
  let nonOwner: SignerWithAddress;

  let nounId = 151;
  let startTime = 1687547165;
  let endTime = 1687548065;
  let settled = false;
  let blocknumber = "10000";
  let blocknumberHash = '0xfabef54918612d0b1d372eb0b5c32f847a131f541512be578feebe9bde379c97';

  let domain = {
    name: "NOMONOUNS",
    version: "1",
    chainId: 31337,
    verifyingContract: "",
  };

  let types = {
    Minter: [
      { name: "nounsId", type: "uint256" },
      { name: "blocknumberHash", type: "bytes32" },
      { name: "auctionStartTimestamp", type: "uint256" },
      { name: "auctionEndTimestamp", type: "uint256" },
    ],
  };

  beforeEach(async () => {
    [owner, nonOwner] = await ethers.getSigners();

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
      nomoNounsSeeder.address,
      mockDescriptor.address
    );

    domain.verifyingContract = nomoNouns.address;

  });

  describe("Deployment", async () => {
    it("should deploy", async function () {
      expect(nomoNounsSeeder.address).to.not.equal("");
      expect(nomoNouns.address).to.not.equal("");
      expect(mockDescriptor.address).to.not.equal("");
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

    it("Withdraw should WITHDRAW_NO_BALANCE", async () => {
      await expect(nomoNouns.withdraw()).to.be.reverted;
    });
  });

  describe("Testing Mint function", async () => {

    //GENERAL COMMENTARY ABOUT THE CHANGES:
    // Since we cannot check the auction house for data, we have to rely on the values used in the signature as source of truth and assume the signer to be honest.
    // This means that we validate the values being supplied to the function by checking if they are the same as the ones in the signature (and afterwards check for stuff like expiration etc.).


    it("Mint: should revert with Invalid Signature", async () => {

      const signature = await nonOwner._signTypedData(domain, types, {
        nounsId: nounId,
        blocknumberHash: blocknumberHash,
        auctionStartTimestamp: startTime,
        auctionEndTimestamp: endTime,
      });

      await expect(
        nomoNouns.mint(nounId, blocknumberHash, startTime, endTime, 1, signature)
      ).to.be.revertedWith("Invalid signature");
    });

    it("Mint: should revert when Minting Expired", async () => {

      const shortAuctionStart=  await time.latest()

      const signature = await owner._signTypedData(domain, types, {
        nounsId: nounId,
        blocknumberHash: blocknumberHash,
        auctionStartTimestamp: shortAuctionStart,
        auctionEndTimestamp: shortAuctionStart + 10,
      });

      await time.increaseTo(shortAuctionStart +11);

      //Valid signature, but minting expired
      await expect(
        nomoNouns.mint(nounId, blocknumberHash, shortAuctionStart, (shortAuctionStart + 10), 1, signature)
      ).to.be.revertedWith("Minting expired");
    });

    it("Mint: should revert with invalid NounId", async () => {
      const signature = await owner._signTypedData(domain, types, {
        nounsId: 9999,
        blocknumberHash: blocknumberHash,
        auctionStartTimestamp: startTime,
        auctionEndTimestamp: endTime,
      });
      
      //Noun trying to be minted does not correspond to the one in the signature
      await expect(
        nomoNouns.mint(50, blocknumberHash, startTime, endTime, 1, signature)
      ).to.be.revertedWith("Invalid signature");
    });

    it("Mint: should revert with Not enough ETH to pay", async () => {
      const signature = await owner._signTypedData(domain, types, {
        nounsId: nounId,
        blocknumberHash: blocknumberHash,
        auctionStartTimestamp: startTime,
        auctionEndTimestamp: endTime,
      });

      await expect(
        nomoNouns.mint(nounId, blocknumberHash, startTime, endTime, 1, signature, { value: 0 })
      ).to.be.revertedWith("Not enough ETH to pay");
    });

    it("Mint: it should mint a single token", async () => {
      const signature = await owner._signTypedData(domain, types, {
        nounsId: nounId,
        blocknumberHash: blocknumberHash,
        auctionStartTimestamp: startTime,
        auctionEndTimestamp: endTime,
      });

      await expect(
        nomoNouns.mint(nounId, blocknumberHash, startTime, endTime, 1, signature, {
          value: ethers.utils.parseUnits((20).toString(), "ether"),
        })
      ).not.to.be.reverted;

      expect(await nomoNouns.balanceOf(owner.address)).to.eq(
        ethers.BigNumber.from("1")
      );
    });

    it("Mint: it should mint 5 tokens", async () => {
      const signature = await owner._signTypedData(domain, types, {
        nounsId: nounId,
        blocknumberHash: blocknumberHash,
        auctionStartTimestamp: startTime,
        auctionEndTimestamp: endTime,
      });

      await expect(
        nomoNouns.mint(nounId, blocknumberHash, startTime, endTime, 5, signature, {
          value: ethers.utils.parseUnits((20).toString(), "ether"),
        })
      ).not.to.be.reverted;

      expect(await nomoNouns.balanceOf(owner.address)).to.eq(
        ethers.BigNumber.from("5")
      );
    });

    it("Mint: it should use the auction nounId for all tokens minted", async () => {

      const signature = await owner._signTypedData(domain, types, {
        nounsId: 50,
        blocknumberHash: blocknumberHash,
        auctionStartTimestamp: startTime,
        auctionEndTimestamp: endTime,
      });

      await expect(
        nomoNouns.mint(50, blocknumberHash, startTime, endTime, 500, signature, {
          value: ethers.utils.parseUnits((20).toString(), "ether"),
        })
      ).not.to.be.reverted;
      await expect(
        nomoNouns.mint(50, blocknumberHash, startTime, endTime, 1, signature, {
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
        blocknumberHash: blocknumberHash,
        auctionStartTimestamp: startTime,
        auctionEndTimestamp: endTime,
      });


      await nomoNouns.mint(nounId, blocknumberHash,  startTime, endTime, 1, signature, {
        value: ethers.utils.parseUnits((20).toString(), "ether"),
      });

      await nomoNouns.withdraw();

      let balance = await ethers.provider.getBalance(nomoNouns.address);
      expect(balance).to.eq(ethers.BigNumber.from("0"));
    });
  });
});
