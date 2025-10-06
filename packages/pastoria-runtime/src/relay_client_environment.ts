import type {Request} from 'express';
import {
  EnvironmentProviderOptions,
  IEnvironmentProvider,
  PreloadedEntryPoint,
  PreloadedQuery,
} from 'react-relay';
import {
  Environment,
  Network,
  OperationDescriptor,
  OperationType,
  PayloadData,
  RecordSource,
  Store,
} from 'relay-runtime';

export type AnyPreloadedQuery = PreloadedQuery<OperationType>;
export type AnyPreloadedEntryPoint = PreloadedEntryPoint<any>;
export type RouterOps = [OperationDescriptor, PayloadData][];

export type EnvironmentProvider =
  IEnvironmentProvider<EnvironmentProviderOptions>;

export interface RelayResolverContext {
  cookies?: Request['cookies'];
}

function createClientNetwork() {
  return Network.create(async (params, variables) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
export const relayClientEnvironment: EnvironmentProvider = {
  getEnvironment() {
    if (typeof window === 'undefined') {
      throw new Error(
        'Cannot initialize client environment in a server environment!',
      );
    }

    if (clientEnv == null) {
      const resolverContext: RelayResolverContext = {};

      clientEnv = new Environment({
        network: createClientNetwork(),
        store: new Store(new RecordSource(), {resolverContext}),
        isServer: false,
      });
    }

    return clientEnv;
  },
};
