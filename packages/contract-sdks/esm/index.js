import { Contract } from 'ethers';
import goerli_auctionHouse_abi from '../eth-sdk/abis/goerli/auctionHouse.json';
import goerli_nomoToken_abi from '../eth-sdk/abis/goerli/nomoToken.json';
import goerli_nomoSeeder_abi from '../eth-sdk/abis/goerli/nomoSeeder.json';
import mainnet_auctionHouse_abi from '../eth-sdk/abis/mainnet/auctionHouse.json';
import mainnet_nomoToken_abi from '../eth-sdk/abis/mainnet/nomoToken.json';
import mainnet_nomoSeeder_abi from '../eth-sdk/abis/mainnet/nomoSeeder.json';
import optimisticGoerli_nomoToken_abi from '../eth-sdk/abis/optimisticGoerli/nomoToken.json';
import optimisticGoerli_nomoSeeder_abi from '../eth-sdk/abis/optimisticGoerli/nomoSeeder.json';
import optimism_nomoToken_abi from '../eth-sdk/abis/optimism/nomoToken.json';
import optimism_nomoSeeder_abi from '../eth-sdk/abis/optimism/nomoSeeder.json';
export function getContract(address, abi, defaultSignerOrProvider) {
    return new Contract(address, abi, defaultSignerOrProvider);
}
export function getGoerliSdk(defaultSignerOrProvider) {
    return {
        "auctionHouse": getContract('0xd47CF1d9AB1fAf81F802Cc80fdf0dab86A81a709', goerli_auctionHouse_abi, defaultSignerOrProvider),
        "nomoToken": getContract('0x495d5b72df0598adb6c84dbcb94edc4b409e5a50', goerli_nomoToken_abi, defaultSignerOrProvider),
        "nomoSeeder": getContract('0x2269CDd6651C813012aE714885f3609813fbd561', goerli_nomoSeeder_abi, defaultSignerOrProvider),
    };
}
export function getMainnetSdk(defaultSignerOrProvider) {
    return {
        "auctionHouse": getContract('0x830BD73E4184ceF73443C15111a1DF14e495C706', mainnet_auctionHouse_abi, defaultSignerOrProvider),
        "nomoToken": getContract('0xbe37CC3F8f7E1E4C264Ba5818482fA75e2D1823e', mainnet_nomoToken_abi, defaultSignerOrProvider),
        "nomoSeeder": getContract('0xb5fCF67C2ec74248692AfCCFDd5d22De49187CAc', mainnet_nomoSeeder_abi, defaultSignerOrProvider),
    };
}
export function getOptimisticGoerliSdk(defaultSignerOrProvider) {
    return {
        "nomoToken": getContract('0xa9D1b7F5422c225b5E94c56C5354838ee0FF5d98', optimisticGoerli_nomoToken_abi, defaultSignerOrProvider),
        "nomoSeeder": getContract('0x95D62E2Ac64181599bcb2A0cA148FF7d2d94130E', optimisticGoerli_nomoSeeder_abi, defaultSignerOrProvider),
    };
}
export function getOptimismSdk(defaultSignerOrProvider) {
    return {
        "nomoToken": getContract('0x1464eBBf9ecd642d42Db8e8827919fdd4A786987', optimism_nomoToken_abi, defaultSignerOrProvider),
        "nomoSeeder": getContract('0xD5CA8ad163a342Bb769C5157934C9F1cC2b0EFC6', optimism_nomoSeeder_abi, defaultSignerOrProvider),
    };
}
