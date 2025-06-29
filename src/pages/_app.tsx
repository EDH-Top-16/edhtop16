import { PropsWithChildren } from "react";

export function App({ children }: PropsWithChildren<{}>) {
  return <main className="relative min-h-screen bg-[#514f86]">{children}</main>;
}
