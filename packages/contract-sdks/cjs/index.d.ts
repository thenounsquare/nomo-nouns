import { providers, Signer } from 'ethers';
import * as types from './types';
export declare function getContract(address: string, abi: object, defaultSignerOrProvider: Signer | providers.Provider): any;
export type GoerliSdk = ReturnType<typeof getGoerliSdk>;
export declare function getGoerliSdk(defaultSignerOrProvider: Signer | providers.Provider): {
    auctionHouse: types.goerli.AuctionHouse;
    nomoToken: types.goerli.NomoToken;
    nomoSeeder: types.goerli.NomoSeeder;
};
export type MainnetSdk = ReturnType<typeof getMainnetSdk>;
export declare function getMainnetSdk(defaultSignerOrProvider: Signer | providers.Provider): {
    auctionHouse: types.mainnet.AuctionHouse;
    nomoToken: types.mainnet.NomoToken;
    nomoSeeder: types.mainnet.NomoSeeder;
};
export type OptimisticGoerliSdk = ReturnType<typeof getOptimisticGoerliSdk>;
export declare function getOptimisticGoerliSdk(defaultSignerOrProvider: Signer | providers.Provider): {
    nomoToken: types.optimisticGoerli.NomoToken;
    nomoSeeder: types.optimisticGoerli.NomoSeeder;
};
export type OptimismSdk = ReturnType<typeof getOptimismSdk>;
export declare function getOptimismSdk(defaultSignerOrProvider: Signer | providers.Provider): {
    nomoToken: types.optimism.NomoToken;
    nomoSeeder: types.optimism.NomoSeeder;
};
