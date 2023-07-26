import { defineConfig } from "@dethcrypto/eth-sdk";

export default defineConfig({
  contracts: {
    goerli: {
      auctionHouse: "0xd47CF1d9AB1fAf81F802Cc80fdf0dab86A81a709",
      nomoToken: "0x495d5b72df0598adb6c84dbcb94edc4b409e5a50",
      nomoSeeder: "0x2269CDd6651C813012aE714885f3609813fbd561",
    },
    mainnet: {
      auctionHouse: "0x830BD73E4184ceF73443C15111a1DF14e495C706",
      nomoToken: "0xbe37CC3F8f7E1E4C264Ba5818482fA75e2D1823e",
      nomoSeeder: "0xb5fCF67C2ec74248692AfCCFDd5d22De49187CAc",
    },
    optimisticGoerli: {
      nomoToken:"0xa9D1b7F5422c225b5E94c56C5354838ee0FF5d98",
      nomoSeeder: "0x95D62E2Ac64181599bcb2A0cA148FF7d2d94130E",
    },
    optimism: {
      nomoToken:"0x1464eBBf9ecd642d42Db8e8827919fdd4A786987",
      nomoSeeder: "0xD5CA8ad163a342Bb769C5157934C9F1cC2b0EFC6",
    }
  },
  outputPath: "./",
});
