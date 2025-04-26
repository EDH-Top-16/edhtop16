import { graphql } from "graphql";
import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
} from "relay-runtime";
import { createContext } from "./context";
import { schema } from "./schema";
import { readFile } from "node:fs/promises";

let persistedQueryCache: Promise<Record<string, string>> | null = null;
async function getPersistedQuery(id: string) {
  if (persistedQueryCache == null) {
    persistedQueryCache = (async () => {
      const persistedQueriesSource = await readFile(
        "src/queries/persisted_queries.json",
      );

      return JSON.parse(persistedQueriesSource.toString("utf-8"));
    })();
  }

  const persistedQueries = await persistedQueryCache;
  return persistedQueries[id] ?? null;
}

const networkFetchFunction: FetchFunction = async (request, variables) => {
  let source = request.text;
  if (source == null && request.id) {
    source = await getPersistedQuery(request.id);
  }

  if (source == null) {
    throw new Error(`Could not find source for query: ${request.id}`);
  }

  const results = await graphql({
    schema,
    source,
    variableValues: variables,
    contextValue: createContext(),
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
