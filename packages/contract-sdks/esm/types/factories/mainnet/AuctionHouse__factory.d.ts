import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { AuctionHouse, AuctionHouseInterface } from "../../mainnet/AuctionHouse";
export declare class AuctionHouse__factory {
    static readonly abi: ({
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
    } | {
        inputs: any[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: any[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): AuctionHouseInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): AuctionHouse;
}
