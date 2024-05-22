import { QueryParamsProvider } from "@reverecre/next-query-params";
import { AppProps } from "next/app";
import { RelayEnvironmentProvider } from "react-relay";
import { useRelayNextjs } from "relay-nextjs/app";
import { getClientEnvironment } from "../lib/client/relay_client_environment";

import "../globals.css";

export default function EdhTop16App({ Component, pageProps }: AppProps) {
  const { env, ...relayProps } = useRelayNextjs(pageProps, {
    createClientEnvironment: () => getClientEnvironment()!,
  });

  return (
    <QueryParamsProvider>
      <RelayEnvironmentProvider environment={env}>
        <Component {...pageProps} {...relayProps} />
      </RelayEnvironmentProvider>
    </QueryParamsProvider>
  );
}
