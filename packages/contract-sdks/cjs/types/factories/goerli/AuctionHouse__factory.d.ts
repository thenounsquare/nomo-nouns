import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { AuctionHouse, AuctionHouseInterface } from "../../goerli/AuctionHouse";
export declare class AuctionHouse__factory {
    static readonly abi: ({
        inputs: any[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
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
    })[];
    static createInterface(): AuctionHouseInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): AuctionHouse;
}
