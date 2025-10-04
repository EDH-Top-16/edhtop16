import express from 'express';
import {GraphQLSchema} from 'graphql';
import {ComponentType, PropsWithChildren} from 'react';
import {
  AnyPreloadedEntryPoint,
  EnvironmentProvider,
} from '../relay_client_environment';

type RouterRootComponent = ComponentType<{}>;
type CreateRouterRootFn = (
  initialEntryPoint: AnyPreloadedEntryPoint | null,
  provider: EnvironmentProvider,
  initialPath?: string,
) => RouterRootComponent;
type LoadEntryPointFn = (
  provider: EnvironmentProvider,
  initialPath?: string,
) => AnyPreloadedEntryPoint;
type CreateContextFn = (req: express.Request) => unknown;
type AppComponent = ComponentType<PropsWithChildren<{}>>;

export async function createRouterHandler(
  routes: string[],
  loadEntryPoint: LoadEntryPointFn,
  createAppFromEntryPoint: CreateRouterRootFn,
  App: AppComponent | null,
  schema: GraphQLSchema,
  createContext: CreateContextFn,
): Promise<express.Router> {
  return express.Router();
}
