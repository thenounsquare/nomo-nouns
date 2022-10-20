import * as process from "process";
import {NomoNounsDescriptor} from "../typechain-types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

const {expect} = require("chai");
const {ethers, network} = require("hardhat");

describe("NOMO NOUNS Descriptor Testing", async () => {
    let nomoNounsDescriptor: NomoNounsDescriptor;
    let owner: SignerWithAddress;
    let nonOwner: SignerWithAddress;

    before(async () => {
        [owner, nonOwner] = await ethers.getSigners();

        const NomoNFTDescriptor = await ethers.getContractFactory(
            "NomoNFTDescriptor"
        );

        const MockArt = await ethers.getContractFactory("MockArt");
        const mockArt = await MockArt.deploy();

        const nomoNftDescriptor = await NomoNFTDescriptor.deploy();

        const NomoNounsDescriptor = await ethers.getContractFactory(
            "NomoNounsDescriptor",
            {
                libraries: {NomoNFTDescriptor: nomoNftDescriptor.address},
            }
        );

        nomoNounsDescriptor = await NomoNounsDescriptor.deploy(
            mockArt.address,
            process.env.NOUNS_RENDERER_ADDR
        );
    });

    describe("Deployment", async () => {
        it("should deploy", async function () {
            expect(nomoNounsDescriptor.address).to.not.equal("");
        });
    });

    describe("Background overrides", async () => {
        it("should return the original color for a background if it does not have an override", async () => {
            expect(await nomoNounsDescriptor.backgrounds("0")).to.equal("d5d7e1");
        });

        it("should return the override color for a background if it has one", async () => {
            await nomoNounsDescriptor.setBackgroundOverride("0", "ff3260");
            expect(await nomoNounsDescriptor.backgrounds("0")).to.equal("ff3260");
        });

        it("should return the original color for a background if the override is unset", async () => {
            await nomoNounsDescriptor.setBackgroundOverride("0", "ff3260");
            await nomoNounsDescriptor.unsetBackgroundOverride("0");
            expect(await nomoNounsDescriptor.backgrounds("0")).to.equal("d5d7e1");
        });
    });
});
