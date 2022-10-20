import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { NomoSeeder, NomoSeederInterface } from "../../goerli/NomoSeeder";
export declare class NomoSeeder__factory {
    static readonly abi: {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            components: {
                internalType: string;
                name: string;
                type: string;
            }[];
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): NomoSeederInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): NomoSeeder;
}
