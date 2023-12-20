import { AppProps } from "next/app";
import { ContextProvider } from "../context/context";
import "../globals.css";

export default function EdhTop16App({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  );
}
