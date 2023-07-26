"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptimismSdk = exports.getOptimisticGoerliSdk = exports.getMainnetSdk = exports.getGoerliSdk = exports.getContract = void 0;
const ethers_1 = require("ethers");
const auctionHouse_json_1 = __importDefault(require("../eth-sdk/abis/goerli/auctionHouse.json"));
const nomoToken_json_1 = __importDefault(require("../eth-sdk/abis/goerli/nomoToken.json"));
const nomoSeeder_json_1 = __importDefault(require("../eth-sdk/abis/goerli/nomoSeeder.json"));
const auctionHouse_json_2 = __importDefault(require("../eth-sdk/abis/mainnet/auctionHouse.json"));
const nomoToken_json_2 = __importDefault(require("../eth-sdk/abis/mainnet/nomoToken.json"));
const nomoSeeder_json_2 = __importDefault(require("../eth-sdk/abis/mainnet/nomoSeeder.json"));
const nomoToken_json_3 = __importDefault(require("../eth-sdk/abis/optimisticGoerli/nomoToken.json"));
const nomoSeeder_json_3 = __importDefault(require("../eth-sdk/abis/optimisticGoerli/nomoSeeder.json"));
const nomoToken_json_4 = __importDefault(require("../eth-sdk/abis/optimism/nomoToken.json"));
const nomoSeeder_json_4 = __importDefault(require("../eth-sdk/abis/optimism/nomoSeeder.json"));
function getContract(address, abi, defaultSignerOrProvider) {
    return new ethers_1.Contract(address, abi, defaultSignerOrProvider);
}
exports.getContract = getContract;
function getGoerliSdk(defaultSignerOrProvider) {
    return {
        "auctionHouse": getContract('0xd47CF1d9AB1fAf81F802Cc80fdf0dab86A81a709', auctionHouse_json_1.default, defaultSignerOrProvider),
        "nomoToken": getContract('0x495d5b72df0598adb6c84dbcb94edc4b409e5a50', nomoToken_json_1.default, defaultSignerOrProvider),
        "nomoSeeder": getContract('0x2269CDd6651C813012aE714885f3609813fbd561', nomoSeeder_json_1.default, defaultSignerOrProvider),
    };
}
exports.getGoerliSdk = getGoerliSdk;
function getMainnetSdk(defaultSignerOrProvider) {
    return {
        "auctionHouse": getContract('0x830BD73E4184ceF73443C15111a1DF14e495C706', auctionHouse_json_2.default, defaultSignerOrProvider),
        "nomoToken": getContract('0xbe37CC3F8f7E1E4C264Ba5818482fA75e2D1823e', nomoToken_json_2.default, defaultSignerOrProvider),
        "nomoSeeder": getContract('0xb5fCF67C2ec74248692AfCCFDd5d22De49187CAc', nomoSeeder_json_2.default, defaultSignerOrProvider),
    };
}
exports.getMainnetSdk = getMainnetSdk;
function getOptimisticGoerliSdk(defaultSignerOrProvider) {
    return {
        "nomoToken": getContract('0xa9D1b7F5422c225b5E94c56C5354838ee0FF5d98', nomoToken_json_3.default, defaultSignerOrProvider),
        "nomoSeeder": getContract('0x95D62E2Ac64181599bcb2A0cA148FF7d2d94130E', nomoSeeder_json_3.default, defaultSignerOrProvider),
    };
}
exports.getOptimisticGoerliSdk = getOptimisticGoerliSdk;
function getOptimismSdk(defaultSignerOrProvider) {
    return {
        "nomoToken": getContract('0x1464eBBf9ecd642d42Db8e8827919fdd4A786987', nomoToken_json_4.default, defaultSignerOrProvider),
        "nomoSeeder": getContract('0xD5CA8ad163a342Bb769C5157934C9F1cC2b0EFC6', nomoSeeder_json_4.default, defaultSignerOrProvider),
    };
}
exports.getOptimismSdk = getOptimismSdk;
