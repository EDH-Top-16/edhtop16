import { graphql } from "graphql";
import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
} from "relay-runtime";
import { schema } from "./schema";

const networkFetchFunction: FetchFunction = async (request, variables) => {
  const results = await graphql({
    schema,
    source: request.text!,
    variableValues: variables,
    contextValue: {},
  });

  return results as any;
};

export function createServerEnvironment() {
  return new Environment({
    network: Network.create(networkFetchFunction),
    store: new Store(new RecordSource()),
    isServer: true,
  });
}
