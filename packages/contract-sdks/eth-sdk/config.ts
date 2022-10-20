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
  },
  outputPath: "./",
});
