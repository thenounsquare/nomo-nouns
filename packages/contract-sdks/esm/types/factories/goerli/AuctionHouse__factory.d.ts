import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { AuctionHouse, AuctionHouseInterface } from "../../goerli/AuctionHouse";
export declare class AuctionHouse__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "auction";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "nounId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "startTime";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "endTime";
            readonly type: "uint256";
        }, {
            readonly internalType: "address payable";
            readonly name: "bidder";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "settled";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "nounId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "startTime";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "endTime";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "settled";
            readonly type: "bool";
        }];
        readonly name: "createAuction";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): AuctionHouseInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): AuctionHouse;
}
