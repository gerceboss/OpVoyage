import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/themes";
import Head from "next/head";
import { DESCRIPTION, TITLE } from "@/constants/texts";
import { wagmiConfig } from "@/constants/web3";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleAnalytics } from "nextjs-google-analytics";
import ProgressBar from "@uiuxarghya/progress-bar";
import { Router } from "next/router";

// Font
import "@fontsource/inconsolata/400.css";
import "@fontsource/inconsolata/500.css";
import "@fontsource/inconsolata/600.css";
import "@fontsource/inconsolata/700.css";

const client = new QueryClient();
const progress = new ProgressBar({
  color: theme.colors.primary[500],
});

const App = ({ Component, pageProps }: AppProps) => {
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
  }, []);

  useEffect(() => {
    Router.events.on("routeChangeStart", progress.start);
    Router.events.on("routeChangeComplete", progress.finish);
  }, [Router]);

  return (
    <>
      <Head>
        <title key="title">{TITLE}</title>
        <meta name="description" content={DESCRIPTION} key="description" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://evmtrace.info/" />
        <meta key="og-title" property="og:title" content={TITLE} />
        <meta
          key="og-description"
          property="og:description"
          content={DESCRIPTION}
        />
        <meta key="og-image" property="og:image" content="/logo.svg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://evmtrace.info/" />
        <meta key="twitter-title" property="twitter:title" content={TITLE} />
        <meta
          key="twitter-description"
          property="twitter:description"
          content={DESCRIPTION}
        />
        <meta
          key="twitter-image"
          property="twitter:image"
          content="/logo.svg"
        />
        <title key="title">{TITLE}</title>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <meta name="theme-color" content="#05060E" />
        <meta
          name="keywords"
          content="EVM, traces, blockchain, block explorer, zk, aa"
        />
      </Head>
      {typeof window === "undefined" || !showChild ? (
        <></>
      ) : (
        <WagmiConfig config={wagmiConfig}>
          <ChakraProvider
            theme={theme}
            toastOptions={{
              defaultOptions: {
                position: "top-right",
                isClosable: true,
                duration: 2000,
                variant: "subtle",
              },
            }}
          >
            <QueryClientProvider client={client}>
              <GoogleAnalytics trackPageViews />
              <Component {...pageProps} />
            </QueryClientProvider>
          </ChakraProvider>
        </WagmiConfig>
      )}
    </>
  );
};

export default App;
