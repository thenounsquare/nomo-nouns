import { Chain, chain, Client, configureChains, createClient } from "wagmi";
import { getDefaultClient } from "connectkit";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

export const getClient = () => {
  const { chains, provider, webSocketProvider } = configureChains(
    [import.meta.env.PROD ? chain.mainnet : chain.goerli],
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
          qrcode: false,
        },
      }),
    ],
  });
};
