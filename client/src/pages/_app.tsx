import { QueryParamsProvider } from "@reverecre/next-query-params";
import cn from "classnames";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { RelayEnvironmentProvider } from "react-relay";
import { useRelayNextjs } from "relay-nextjs/app";
import { getClientEnvironment } from "../lib/client/relay_client_environment";

import "../globals.css";

const montserrat = Montserrat({
  weight: ["500", "600", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function EdhTop16App({ Component, pageProps }: AppProps) {
  const { env, ...relayProps } = useRelayNextjs(pageProps, {
    createClientEnvironment: () => getClientEnvironment()!,
  });

  return (
    <QueryParamsProvider>
      <RelayEnvironmentProvider environment={env}>
        <DefaultSeo
          titleTemplate="%s | EDHTop 16"
          additionalLinkTags={[{ rel: "icon", href: "/v2/icon.png" }]}
        />

        <main
          className={cn(
            montserrat.variable,
            "relative min-h-screen bg-[#514f86]",
          )}
        >
          <Component {...pageProps} {...relayProps} />
        </main>
      </RelayEnvironmentProvider>
    </QueryParamsProvider>
  );
}
