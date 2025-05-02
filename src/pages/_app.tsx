import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryParamsProvider } from "@reverecre/next-query-params";
import cn from "classnames";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { Router } from "next/router";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { useRelayNextjs } from "relay-nextjs/app";
import { getClientEnvironment } from "../lib/client/relay_client_environment";

import "../globals.css";

const GA_ID = "G-56527VG23P";

const montserrat = Montserrat({
  weight: ["500", "600", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

function usePosthog() {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: "https://us.i.posthog.com",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug();
      },
    });

    const handleRouteChange = () => posthog?.capture("$pageview");

    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);
}

export default function EdhTop16App({ Component, pageProps }: AppProps) {
  const { env, ...relayProps } = useRelayNextjs(pageProps, {
    createClientEnvironment: () => getClientEnvironment()!,
  });

  usePosthog();

  return (
    <PostHogProvider client={posthog}>
      <QueryParamsProvider>
        <RelayEnvironmentProvider environment={env}>
          <DefaultSeo
            titleTemplate="%s | EDHTop 16"
            additionalLinkTags={[{ rel: "icon", href: "/icon.png" }]}
          />

          <main
            className={cn(
              montserrat.variable,
              "relative min-h-screen bg-[#514f86]",
            )}
          >
            <Component {...pageProps} {...relayProps} />
          </main>

          {process.env.NODE_ENV === "production" && (
            <GoogleAnalytics gaId={GA_ID} />
          )}
        </RelayEnvironmentProvider>
      </QueryParamsProvider>
    </PostHogProvider>
  );
}
