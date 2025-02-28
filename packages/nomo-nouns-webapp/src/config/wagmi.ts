import { configureChains, createClient } from "wagmi";
import { optimismGoerli, optimism, mainnet, sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

// Define Optimism Sepolia manually since it is not in the old wagmi version
export const optimismSepolia = {
  id: 11155420,
  name: 'Optimism Sepolia',
  network: 'optimism-sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.optimism.io'],
    },
    public: {
      http: ['https://sepolia.optimism.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Optimism Explorer',
      url: 'https://sepolia-optimism.etherscan.io',
    },
  },
  testnet: true,
};

export const getClient = () => {
  const { chains, provider, webSocketProvider } = configureChains(
    [
      import.meta.env.DEV ? optimismSepolia : optimism,
      import.meta.env.DEV ? sepolia : mainnet
    ],
    [
      // Add a JSON RPC provider specifically for Optimism Sepolia
      jsonRpcProvider({
        rpc: (chain) => {
          if (chain.id === optimismSepolia.id) {
            return { http: 'https://sepolia.optimism.io' };
          }
          return null;
        },
        priority: 0,
      }),
      // Keep Alchemy provider for other networks
      alchemyProvider({
        apiKey: import.meta.env.VITE_ALCHEMY_APP_KEY,
        priority: 1,
      }),
    ],
    { pollingInterval: 60000 }
  );

  return createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
    connectors: [
      new MetaMaskConnector({ chains }),
      new InjectedConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: { appName: "Nomo Nouns", headlessMode: true },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: 
          //import.meta.env.WALLET_CONNECT_PROJECT_ID
          'bc64bb864de80cda3fcd61337a9cfcf6',
          showQrModal: false,
        },
      }),
    ],
  });
};
