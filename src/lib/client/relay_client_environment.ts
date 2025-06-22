import {
  Environment,
  Network,
  PayloadData,
  RecordSource,
  Store,
} from "relay-runtime";
import { OperationDescriptor } from "relay-runtime/lib/store/RelayStoreTypes";

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
        id: params.id,
        variables,
        extensions: {},
      }),
    });

    const json = await response.text();
    return JSON.parse(json);
  });
}

let clientEnv: Environment | undefined;
export function getClientEnvironment() {
  if (typeof window === "undefined") return null;

  if (clientEnv == null) {
    clientEnv = new Environment({
      network: createClientNetwork(),
      store: new Store(new RecordSource()),
      isServer: false,
    });

    const ops = (window as any).__river_ops as [
      OperationDescriptor,
      PayloadData,
    ][];

    for (const [op, payload] of ops) {
      clientEnv.commitPayload(op, payload);
    }
  }

  return clientEnv;
}
