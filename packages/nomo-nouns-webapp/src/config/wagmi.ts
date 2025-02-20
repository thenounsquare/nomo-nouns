import { configureChains, createClient } from "wagmi";
import { optimismGoerli, optimism, mainnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

export const getClient = () => {
  const { chains, provider, webSocketProvider } = configureChains(
    [import.meta.env.DEV ? optimismGoerli : optimism, mainnet],
    [
      alchemyProvider({
        apiKey: import.meta.env.VITE_ALCHEMY_APP_KEY,
        priority: 0,
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
