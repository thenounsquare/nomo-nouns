import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export declare namespace INomoNounsSeeder {
    type SeedStruct = {
        nounId: PromiseOrValue<BigNumberish>;
        background: PromiseOrValue<BigNumberish>;
        body: PromiseOrValue<BigNumberish>;
        accessory: PromiseOrValue<BigNumberish>;
        head: PromiseOrValue<BigNumberish>;
        glasses: PromiseOrValue<BigNumberish>;
    };
    type SeedStructOutput = [
        number,
        number,
        number,
        number,
        number,
        number
    ] & {
        nounId: number;
        background: number;
        body: number;
        accessory: number;
        head: number;
        glasses: number;
    };
}
export interface NomoSeederInterface extends utils.Interface {
    functions: {
        "generateSeed(uint256,bytes32,address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "generateSeed"): FunctionFragment;
    encodeFunctionData(functionFragment: "generateSeed", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>
    ]): string;
    decodeFunctionResult(functionFragment: "generateSeed", data: BytesLike): Result;
    events: {};
}
export interface NomoSeeder extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: NomoSeederInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        generateSeed(nounId: PromiseOrValue<BigNumberish>, nounBlocknumberHash: PromiseOrValue<BytesLike>, descriptor: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[INomoNounsSeeder.SeedStructOutput]>;
    };
    generateSeed(nounId: PromiseOrValue<BigNumberish>, nounBlocknumberHash: PromiseOrValue<BytesLike>, descriptor: PromiseOrValue<string>, overrides?: CallOverrides): Promise<INomoNounsSeeder.SeedStructOutput>;
    callStatic: {
        generateSeed(nounId: PromiseOrValue<BigNumberish>, nounBlocknumberHash: PromiseOrValue<BytesLike>, descriptor: PromiseOrValue<string>, overrides?: CallOverrides): Promise<INomoNounsSeeder.SeedStructOutput>;
    };
    filters: {};
    estimateGas: {
        generateSeed(nounId: PromiseOrValue<BigNumberish>, nounBlocknumberHash: PromiseOrValue<BytesLike>, descriptor: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        generateSeed(nounId: PromiseOrValue<BigNumberish>, nounBlocknumberHash: PromiseOrValue<BytesLike>, descriptor: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
