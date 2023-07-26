import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { NomoSeeder, NomoSeederInterface } from "../../mainnet/NomoSeeder";
export declare class NomoSeeder__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "nounId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "blockNumber";
            readonly type: "uint256";
        }, {
            readonly internalType: "contract INomoNounsDescriptor";
            readonly name: "descriptor";
            readonly type: "address";
        }];
        readonly name: "generateSeed";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint40";
                readonly name: "nounId";
                readonly type: "uint40";
            }, {
                readonly internalType: "uint40";
                readonly name: "background";
                readonly type: "uint40";
            }, {
                readonly internalType: "uint40";
                readonly name: "body";
                readonly type: "uint40";
            }, {
                readonly internalType: "uint40";
                readonly name: "accessory";
                readonly type: "uint40";
            }, {
                readonly internalType: "uint40";
                readonly name: "head";
                readonly type: "uint40";
            }, {
                readonly internalType: "uint40";
                readonly name: "glasses";
                readonly type: "uint40";
            }];
            readonly internalType: "struct INomoNounsSeeder.Seed";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): NomoSeederInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): NomoSeeder;
}
