import { AppProps } from "next/app";
import { useRelayNextjs } from "relay-nextjs/app";
import { ContextProvider } from "../context/context";
import { getClientEnvironment } from "../lib/client/relay_client_environment";

import "../globals.css";
import { RelayEnvironmentProvider } from "react-relay";

export default function EdhTop16App({ Component, pageProps }: AppProps) {
  const { env, ...relayProps } = useRelayNextjs(pageProps, {
    createClientEnvironment: () => getClientEnvironment()!,
  });

  return (
    <RelayEnvironmentProvider environment={env}>
      <ContextProvider>
        <Component {...pageProps} {...relayProps} />
      </ContextProvider>
    </RelayEnvironmentProvider>
  );
}
