import { Environment, RecordSource, Store } from "relay-runtime";
import { createClientNetwork } from "../client/relay_client_environment";

export function createServerEnvironment() {
  return new Environment({
    network: createClientNetwork(),
    store: new Store(new RecordSource()),
    isServer: true,
  });
}
