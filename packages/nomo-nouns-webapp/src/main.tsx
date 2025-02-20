import React, { FC } from "react";
import "./polyfills";
import ReactDOM from "react-dom/client";
import {
  ChakraProvider,
  PropsOf,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import App from "./App";
import "./index.css";
import { theme } from "./theme";
import "@fontsource/londrina-solid";
import { QueryClient, QueryClientProvider } from "react-query";
import { WagmiConfig } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { getClient } from "./config/wagmi";
import LogRocket from "logrocket";
import { Analytics } from "@vercel/analytics/react";
import { NetworkWarning } from "./components/NetworkWarning";

if (import.meta.env.PROD) {
  LogRocket.init("9adwg7/nomonouns");
}

const client = getClient();

const ThemedConnectKitProvider: FC<PropsOf<typeof ConnectKitProvider>> = ({
  children,
}) => {
  const { colorMode } = useColorMode();
  const connectKitTheme = {
    "--ck-font-family": `'Londrina Solid', sans-serif`,
    "--ck-connectbutton-border-radius": "var(--chakra-radii-md)",
    "--ck-connectbutton-background": useColorModeValue(
      "var(--chakra-colors-gray-100)",
      "var(--chakra-colors-whiteAlpha-200)"
    ),
    "--ck-connectbutton-hover-background": useColorModeValue(
      "var(--chakra-colors-gray-200)",
      "var(--chakra-colors-whiteAlpha-300)"
    ),
    "--ck-connectbutton-active-background": useColorModeValue(
      "var(--chakra-colors-gray-300)",
      "var(--chakra-colors-whiteAlpha-400)"
    ),
  };
  return (
    <ConnectKitProvider customTheme={connectKitTheme} mode={colorMode}>
      {children}
    </ConnectKitProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <React.StrictMode>
      <QueryClientProvider client={new QueryClient()}>
        <ChakraProvider theme={theme}>
          <WagmiConfig client={client}>
            <ThemedConnectKitProvider>
              <NetworkWarning />
              <App />
            </ThemedConnectKitProvider>
          </WagmiConfig>
        </ChakraProvider>
      </QueryClientProvider>
    </React.StrictMode>
    <Analytics />
  </>
);
