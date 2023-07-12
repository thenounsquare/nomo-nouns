import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import { config as dotEnv } from "dotenv";
import "hardhat-abi-exporter";
import "@nomicfoundation/hardhat-toolbox";
import "./tasks";

dotEnv();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10_000,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // forking: {
      //   url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_APP_KEY}`,
      // },
      initialBaseFeePerGas: 0,
  },
  mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_APP_KEY}`,
      // @ts-ignore
      accounts: [process.env.WALLET_PRIVATE_KEY],
  },
  goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_APP_KEY}`,
      // @ts-ignore
      accounts: [process.env.WALLET_PRIVATE_KEY],
  },
  optimisticGoerli: {
      url: `https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        accounts: process.env.MNEMONIC
          ? { mnemonic: process.env.MNEMONIC }
          : [process.env.WALLET_PRIVATE_KEY!].filter(Boolean),
  },
  optimism_mainnet: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_OP_MAINNET_API_KEY}`,
        accounts: process.env.MNEMONIC
          ? { mnemonic: process.env.MNEMONIC }
          : [process.env.WALLET_PRIVATE_KEY!].filter(Boolean),
      },
    localhost: {
      url: "http://localhost:8545",
      accounts: process.env.MNEMONIC
      ? { mnemonic: process.env.MNEMONIC }
      : [process.env.WALLET_PRIVATE_KEY!].filter(Boolean),
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      optimism_mainnet: process.env.OP_ETHERSCAN_API_KEY,
      optimisticGoerli: process.env.OP_ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "optimism_mainnet",
        chainId: 10,
        urls: {
          apiURL: "https://api-optimistic.etherscan.io/api",
          browserURL: "https://optimistic.etherscan.io"
        }
      }
    ]
  },
  abiExporter: {
    path: "./abi",
    clear: true,
  },
  gasReporter: {
    enabled: !process.env.CI,
    currency: "USD",
    gasPrice: 30,
    src: "contracts",
    coinmarketcap: "7643dfc7-a58f-46af-8314-2db32bdd18ba",
  },
};

export default config;
