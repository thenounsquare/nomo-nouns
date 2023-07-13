import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
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
export declare namespace IERC721A {
    type TokenOwnershipStruct = {
        addr: PromiseOrValue<string>;
        startTimestamp: PromiseOrValue<BigNumberish>;
        burned: PromiseOrValue<boolean>;
        extraData: PromiseOrValue<BigNumberish>;
    };
    type TokenOwnershipStructOutput = [
        string,
        BigNumber,
        boolean,
        number
    ] & {
        addr: string;
        startTimestamp: BigNumber;
        burned: boolean;
        extraData: number;
    };
}
export interface NomoTokenInterface extends utils.Interface {
    functions: {
        "_verify(uint256,uint256,bytes)": FunctionFragment;
        "approve(address,uint256)": FunctionFragment;
        "auctionHouse()": FunctionFragment;
        "balanceOf(address)": FunctionFragment;
        "contractURI()": FunctionFragment;
        "dataURI(uint256)": FunctionFragment;
        "descriptor()": FunctionFragment;
        "explicitOwnershipOf(uint256)": FunctionFragment;
        "explicitOwnershipsOf(uint256[])": FunctionFragment;
        "getApproved(uint256)": FunctionFragment;
        "getMintingPrice(uint256)": FunctionFragment;
        "isApprovedForAll(address,address)": FunctionFragment;
        "mint(uint256,uint256,uint256,bytes)": FunctionFragment;
        "mintingIncreaseInterval()": FunctionFragment;
        "mintingPriceIncreasePerInterval()": FunctionFragment;
        "mintingStartPrice()": FunctionFragment;
        "name()": FunctionFragment;
        "nounIdOfNomo(uint256)": FunctionFragment;
        "owner()": FunctionFragment;
        "ownerOf(uint256)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "safeTransferFrom(address,address,uint256)": FunctionFragment;
        "safeTransferFrom(address,address,uint256,bytes)": FunctionFragment;
        "seeder()": FunctionFragment;
        "seeds(uint256)": FunctionFragment;
        "setApprovalForAll(address,bool)": FunctionFragment;
        "setContractURIHash(string)": FunctionFragment;
        "setDescriptor(address)": FunctionFragment;
        "setMintingIncreaseInterval(uint256)": FunctionFragment;
        "setMintingPriceIncreasePerInterval(uint256)": FunctionFragment;
        "setMintingStartPrice(uint256)": FunctionFragment;
        "setSeeder(address)": FunctionFragment;
        "setSigner(address)": FunctionFragment;
        "setWithdrawWallet(address)": FunctionFragment;
        "signer()": FunctionFragment;
        "supportsInterface(bytes4)": FunctionFragment;
        "symbol()": FunctionFragment;
        "tokenURI(uint256)": FunctionFragment;
        "tokensOfOwner(address)": FunctionFragment;
        "tokensOfOwnerIn(address,uint256,uint256)": FunctionFragment;
        "totalSupply()": FunctionFragment;
        "transferFrom(address,address,uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "withdraw()": FunctionFragment;
        "withdrawWallet()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "_verify" | "approve" | "auctionHouse" | "balanceOf" | "contractURI" | "dataURI" | "descriptor" | "explicitOwnershipOf" | "explicitOwnershipsOf" | "getApproved" | "getMintingPrice" | "isApprovedForAll" | "mint" | "mintingIncreaseInterval" | "mintingPriceIncreasePerInterval" | "mintingStartPrice" | "name" | "nounIdOfNomo" | "owner" | "ownerOf" | "renounceOwnership" | "safeTransferFrom(address,address,uint256)" | "safeTransferFrom(address,address,uint256,bytes)" | "seeder" | "seeds" | "setApprovalForAll" | "setContractURIHash" | "setDescriptor" | "setMintingIncreaseInterval" | "setMintingPriceIncreasePerInterval" | "setMintingStartPrice" | "setSeeder" | "setSigner" | "setWithdrawWallet" | "signer" | "supportsInterface" | "symbol" | "tokenURI" | "tokensOfOwner" | "tokensOfOwnerIn" | "totalSupply" | "transferFrom" | "transferOwnership" | "withdraw" | "withdrawWallet"): FunctionFragment;
    encodeFunctionData(functionFragment: "_verify", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "approve", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "auctionHouse", values?: undefined): string;
    encodeFunctionData(functionFragment: "balanceOf", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "contractURI", values?: undefined): string;
    encodeFunctionData(functionFragment: "dataURI", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "descriptor", values?: undefined): string;
    encodeFunctionData(functionFragment: "explicitOwnershipOf", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "explicitOwnershipsOf", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "getApproved", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getMintingPrice", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isApprovedForAll", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "mint", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "mintingIncreaseInterval", values?: undefined): string;
    encodeFunctionData(functionFragment: "mintingPriceIncreasePerInterval", values?: undefined): string;
    encodeFunctionData(functionFragment: "mintingStartPrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "name", values?: undefined): string;
    encodeFunctionData(functionFragment: "nounIdOfNomo", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "ownerOf", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "safeTransferFrom(address,address,uint256)", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "safeTransferFrom(address,address,uint256,bytes)", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "seeder", values?: undefined): string;
    encodeFunctionData(functionFragment: "seeds", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setApprovalForAll", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setContractURIHash", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setDescriptor", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setMintingIncreaseInterval", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setMintingPriceIncreasePerInterval", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setMintingStartPrice", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setSeeder", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setSigner", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setWithdrawWallet", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "signer", values?: undefined): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
    encodeFunctionData(functionFragment: "tokenURI", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "tokensOfOwner", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "tokensOfOwnerIn", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferFrom", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdrawWallet", values?: undefined): string;
    decodeFunctionResult(functionFragment: "_verify", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "auctionHouse", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "contractURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dataURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "descriptor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "explicitOwnershipOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "explicitOwnershipsOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getApproved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMintingPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isApprovedForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mintingIncreaseInterval", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mintingPriceIncreasePerInterval", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mintingStartPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nounIdOfNomo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransferFrom(address,address,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransferFrom(address,address,uint256,bytes)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "seeder", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "seeds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setApprovalForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setContractURIHash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDescriptor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMintingIncreaseInterval", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMintingPriceIncreasePerInterval", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMintingStartPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSeeder", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSigner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setWithdrawWallet", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "signer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokensOfOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokensOfOwnerIn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawWallet", data: BytesLike): Result;
    events: {
        "Approval(address,address,uint256)": EventFragment;
        "ApprovalForAll(address,address,bool)": EventFragment;
        "ConsecutiveTransfer(uint256,uint256,address,address)": EventFragment;
        "NomoCreated(uint256,tuple)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "Transfer(address,address,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ConsecutiveTransfer"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "NomoCreated"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}
export interface ApprovalEventObject {
    owner: string;
    approved: string;
    tokenId: BigNumber;
}
export type ApprovalEvent = TypedEvent<[
    string,
    string,
    BigNumber
], ApprovalEventObject>;
export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;
export interface ApprovalForAllEventObject {
    owner: string;
    operator: string;
    approved: boolean;
}
export type ApprovalForAllEvent = TypedEvent<[
    string,
    string,
    boolean
], ApprovalForAllEventObject>;
export type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;
export interface ConsecutiveTransferEventObject {
    fromTokenId: BigNumber;
    toTokenId: BigNumber;
    from: string;
    to: string;
}
export type ConsecutiveTransferEvent = TypedEvent<[
    BigNumber,
    BigNumber,
    string,
    string
], ConsecutiveTransferEventObject>;
export type ConsecutiveTransferEventFilter = TypedEventFilter<ConsecutiveTransferEvent>;
export interface NomoCreatedEventObject {
    nounId: BigNumber;
    seed: INomoNounsSeeder.SeedStructOutput;
}
export type NomoCreatedEvent = TypedEvent<[
    BigNumber,
    INomoNounsSeeder.SeedStructOutput
], NomoCreatedEventObject>;
export type NomoCreatedEventFilter = TypedEventFilter<NomoCreatedEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface TransferEventObject {
    from: string;
    to: string;
    tokenId: BigNumber;
}
export type TransferEvent = TypedEvent<[
    string,
    string,
    BigNumber
], TransferEventObject>;
export type TransferEventFilter = TypedEventFilter<TransferEvent>;
export interface NomoToken extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: NomoTokenInterface;
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
        _verify(nounsId: PromiseOrValue<BigNumberish>, blockNumber: PromiseOrValue<BigNumberish>, signature: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        approve(to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        auctionHouse(overrides?: CallOverrides): Promise<[string]>;
        balanceOf(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        contractURI(overrides?: CallOverrides): Promise<[string]>;
        dataURI(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        descriptor(overrides?: CallOverrides): Promise<[string]>;
        explicitOwnershipOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[IERC721A.TokenOwnershipStructOutput]>;
        explicitOwnershipsOf(tokenIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[IERC721A.TokenOwnershipStructOutput[]]>;
        getApproved(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getMintingPrice(startTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        isApprovedForAll(owner: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        mint(nounId: PromiseOrValue<BigNumberish>, blockNumber: PromiseOrValue<BigNumberish>, quantity: PromiseOrValue<BigNumberish>, _signature: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        mintingIncreaseInterval(overrides?: CallOverrides): Promise<[BigNumber]>;
        mintingPriceIncreasePerInterval(overrides?: CallOverrides): Promise<[BigNumber]>;
        mintingStartPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
        name(overrides?: CallOverrides): Promise<[string]>;
        nounIdOfNomo(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        ownerOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "safeTransferFrom(address,address,uint256)"(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "safeTransferFrom(address,address,uint256,bytes)"(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        seeder(overrides?: CallOverrides): Promise<[string]>;
        seeds(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
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
        }>;
        setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setContractURIHash(newContractURIHash: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setDescriptor(_descriptor: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setMintingIncreaseInterval(_mintingIncreaseInterval: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setMintingPriceIncreasePerInterval(_mintingPriceIncreasePerInterval: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setMintingStartPrice(_mintingStartPrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSeeder(_seeder: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSigner(_signer: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setWithdrawWallet(_withdrawWallet: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        signer(overrides?: CallOverrides): Promise<[string]>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        symbol(overrides?: CallOverrides): Promise<[string]>;
        tokenURI(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        tokensOfOwner(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber[]]>;
        tokensOfOwnerIn(owner: PromiseOrValue<string>, start: PromiseOrValue<BigNumberish>, stop: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber[]]>;
        totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
        transferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdraw(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdrawWallet(overrides?: CallOverrides): Promise<[string]>;
    };
    _verify(nounsId: PromiseOrValue<BigNumberish>, blockNumber: PromiseOrValue<BigNumberish>, signature: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    approve(to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    auctionHouse(overrides?: CallOverrides): Promise<string>;
    balanceOf(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    contractURI(overrides?: CallOverrides): Promise<string>;
    dataURI(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    descriptor(overrides?: CallOverrides): Promise<string>;
    explicitOwnershipOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<IERC721A.TokenOwnershipStructOutput>;
    explicitOwnershipsOf(tokenIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<IERC721A.TokenOwnershipStructOutput[]>;
    getApproved(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getMintingPrice(startTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    isApprovedForAll(owner: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    mint(nounId: PromiseOrValue<BigNumberish>, blockNumber: PromiseOrValue<BigNumberish>, quantity: PromiseOrValue<BigNumberish>, _signature: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    mintingIncreaseInterval(overrides?: CallOverrides): Promise<BigNumber>;
    mintingPriceIncreasePerInterval(overrides?: CallOverrides): Promise<BigNumber>;
    mintingStartPrice(overrides?: CallOverrides): Promise<BigNumber>;
    name(overrides?: CallOverrides): Promise<string>;
    nounIdOfNomo(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<string>;
    ownerOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "safeTransferFrom(address,address,uint256)"(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "safeTransferFrom(address,address,uint256,bytes)"(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    seeder(overrides?: CallOverrides): Promise<string>;
    seeds(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
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
    }>;
    setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setContractURIHash(newContractURIHash: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setDescriptor(_descriptor: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setMintingIncreaseInterval(_mintingIncreaseInterval: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setMintingPriceIncreasePerInterval(_mintingPriceIncreasePerInterval: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setMintingStartPrice(_mintingStartPrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSeeder(_seeder: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSigner(_signer: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setWithdrawWallet(_withdrawWallet: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    symbol(overrides?: CallOverrides): Promise<string>;
    tokenURI(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    tokensOfOwner(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber[]>;
    tokensOfOwnerIn(owner: PromiseOrValue<string>, start: PromiseOrValue<BigNumberish>, stop: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber[]>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    transferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdraw(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdrawWallet(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        _verify(nounsId: PromiseOrValue<BigNumberish>, blockNumber: PromiseOrValue<BigNumberish>, signature: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        approve(to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        auctionHouse(overrides?: CallOverrides): Promise<string>;
        balanceOf(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        contractURI(overrides?: CallOverrides): Promise<string>;
        dataURI(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        descriptor(overrides?: CallOverrides): Promise<string>;
        explicitOwnershipOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<IERC721A.TokenOwnershipStructOutput>;
        explicitOwnershipsOf(tokenIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<IERC721A.TokenOwnershipStructOutput[]>;
        getApproved(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getMintingPrice(startTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isApprovedForAll(owner: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        mint(nounId: PromiseOrValue<BigNumberish>, blockNumber: PromiseOrValue<BigNumberish>, quantity: PromiseOrValue<BigNumberish>, _signature: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        mintingIncreaseInterval(overrides?: CallOverrides): Promise<BigNumber>;
        mintingPriceIncreasePerInterval(overrides?: CallOverrides): Promise<BigNumber>;
        mintingStartPrice(overrides?: CallOverrides): Promise<BigNumber>;
        name(overrides?: CallOverrides): Promise<string>;
        nounIdOfNomo(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<string>;
        ownerOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        "safeTransferFrom(address,address,uint256)"(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        "safeTransferFrom(address,address,uint256,bytes)"(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        seeder(overrides?: CallOverrides): Promise<string>;
        seeds(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
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
        }>;
        setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setContractURIHash(newContractURIHash: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setDescriptor(_descriptor: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setMintingIncreaseInterval(_mintingIncreaseInterval: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setMintingPriceIncreasePerInterval(_mintingPriceIncreasePerInterval: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setMintingStartPrice(_mintingStartPrice: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setSeeder(_seeder: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setSigner(_signer: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setWithdrawWallet(_withdrawWallet: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        signer(overrides?: CallOverrides): Promise<string>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        symbol(overrides?: CallOverrides): Promise<string>;
        tokenURI(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        tokensOfOwner(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber[]>;
        tokensOfOwnerIn(owner: PromiseOrValue<string>, start: PromiseOrValue<BigNumberish>, stop: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber[]>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        transferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        withdraw(overrides?: CallOverrides): Promise<void>;
        withdrawWallet(overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "Approval(address,address,uint256)"(owner?: PromiseOrValue<string> | null, approved?: PromiseOrValue<string> | null, tokenId?: PromiseOrValue<BigNumberish> | null): ApprovalEventFilter;
        Approval(owner?: PromiseOrValue<string> | null, approved?: PromiseOrValue<string> | null, tokenId?: PromiseOrValue<BigNumberish> | null): ApprovalEventFilter;
        "ApprovalForAll(address,address,bool)"(owner?: PromiseOrValue<string> | null, operator?: PromiseOrValue<string> | null, approved?: null): ApprovalForAllEventFilter;
        ApprovalForAll(owner?: PromiseOrValue<string> | null, operator?: PromiseOrValue<string> | null, approved?: null): ApprovalForAllEventFilter;
        "ConsecutiveTransfer(uint256,uint256,address,address)"(fromTokenId?: PromiseOrValue<BigNumberish> | null, toTokenId?: null, from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): ConsecutiveTransferEventFilter;
        ConsecutiveTransfer(fromTokenId?: PromiseOrValue<BigNumberish> | null, toTokenId?: null, from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): ConsecutiveTransferEventFilter;
        "NomoCreated(uint256,tuple)"(nounId?: PromiseOrValue<BigNumberish> | null, seed?: null): NomoCreatedEventFilter;
        NomoCreated(nounId?: PromiseOrValue<BigNumberish> | null, seed?: null): NomoCreatedEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "Transfer(address,address,uint256)"(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null, tokenId?: PromiseOrValue<BigNumberish> | null): TransferEventFilter;
        Transfer(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null, tokenId?: PromiseOrValue<BigNumberish> | null): TransferEventFilter;
    };
    estimateGas: {
        _verify(nounsId: PromiseOrValue<BigNumberish>, blockNumber: PromiseOrValue<BigNumberish>, signature: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        approve(to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        auctionHouse(overrides?: CallOverrides): Promise<BigNumber>;
        balanceOf(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        contractURI(overrides?: CallOverrides): Promise<BigNumber>;
        dataURI(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        descriptor(overrides?: CallOverrides): Promise<BigNumber>;
        explicitOwnershipOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        explicitOwnershipsOf(tokenIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        getApproved(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getMintingPrice(startTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isApprovedForAll(owner: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        mint(nounId: PromiseOrValue<BigNumberish>, blockNumber: PromiseOrValue<BigNumberish>, quantity: PromiseOrValue<BigNumberish>, _signature: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        mintingIncreaseInterval(overrides?: CallOverrides): Promise<BigNumber>;
        mintingPriceIncreasePerInterval(overrides?: CallOverrides): Promise<BigNumber>;
        mintingStartPrice(overrides?: CallOverrides): Promise<BigNumber>;
        name(overrides?: CallOverrides): Promise<BigNumber>;
        nounIdOfNomo(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        ownerOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "safeTransferFrom(address,address,uint256)"(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "safeTransferFrom(address,address,uint256,bytes)"(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        seeder(overrides?: CallOverrides): Promise<BigNumber>;
        seeds(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setContractURIHash(newContractURIHash: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setDescriptor(_descriptor: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setMintingIncreaseInterval(_mintingIncreaseInterval: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setMintingPriceIncreasePerInterval(_mintingPriceIncreasePerInterval: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setMintingStartPrice(_mintingStartPrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSeeder(_seeder: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSigner(_signer: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setWithdrawWallet(_withdrawWallet: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        signer(overrides?: CallOverrides): Promise<BigNumber>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        symbol(overrides?: CallOverrides): Promise<BigNumber>;
        tokenURI(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        tokensOfOwner(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        tokensOfOwnerIn(owner: PromiseOrValue<string>, start: PromiseOrValue<BigNumberish>, stop: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        transferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdraw(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdrawWallet(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        _verify(nounsId: PromiseOrValue<BigNumberish>, blockNumber: PromiseOrValue<BigNumberish>, signature: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        approve(to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        auctionHouse(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        balanceOf(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        contractURI(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        dataURI(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        descriptor(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        explicitOwnershipOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        explicitOwnershipsOf(tokenIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getApproved(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getMintingPrice(startTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isApprovedForAll(owner: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        mint(nounId: PromiseOrValue<BigNumberish>, blockNumber: PromiseOrValue<BigNumberish>, quantity: PromiseOrValue<BigNumberish>, _signature: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        mintingIncreaseInterval(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        mintingPriceIncreasePerInterval(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        mintingStartPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        nounIdOfNomo(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        ownerOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "safeTransferFrom(address,address,uint256)"(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "safeTransferFrom(address,address,uint256,bytes)"(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        seeder(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        seeds(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setContractURIHash(newContractURIHash: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setDescriptor(_descriptor: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setMintingIncreaseInterval(_mintingIncreaseInterval: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setMintingPriceIncreasePerInterval(_mintingPriceIncreasePerInterval: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setMintingStartPrice(_mintingStartPrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSeeder(_seeder: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSigner(_signer: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setWithdrawWallet(_withdrawWallet: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        signer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        tokenURI(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        tokensOfOwner(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        tokensOfOwnerIn(owner: PromiseOrValue<string>, start: PromiseOrValue<BigNumberish>, stop: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdraw(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdrawWallet(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
