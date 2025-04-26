import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";

export function createClientNetwork() {
  return Network.create(async (params, variables) => {
    const response = await fetch("/api/graphql", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: params.text,
        variables,
      }),
    });

    const json = await response.text();
    return JSON.parse(json);
  });
}

let clientEnv: Environment | undefined;
export function getClientEnvironment() {
  if (typeof window === "undefined") return null;

  const records = window.__river_records as RecordMap;
  if (clientEnv == null) {
    clientEnv = new Environment({
      network: createClientNetwork(),
      store: new Store(new RecordSource(records)),
      isServer: false,
    });
  }

  return clientEnv;
}
