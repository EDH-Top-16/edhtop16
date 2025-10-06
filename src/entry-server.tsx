import {JSResource} from '#genfiles/router/js_resource';
import {
  listRoutes,
  router__createAppFromEntryPoint,
  router__loadEntryPoint,
} from '#genfiles/router/router';
import {getSchema} from '#genfiles/schema/schema';
import {Context} from '#src/lib/server/context';
import {App} from '#src/pages/_app';
import {GraphQLSchema, specifiedDirectives} from 'graphql';
import {createRouterHandler} from 'pastoria-runtime/server';
import type {Manifest} from 'vite';

const schemaConfig = getSchema().toConfig();
const schema = new GraphQLSchema({
  ...schemaConfig,
  directives: [...specifiedDirectives, ...schemaConfig.directives],
});

export function createHandler(
  persistedQueries: Record<string, string>,
  manifest?: Manifest,
) {
  return createRouterHandler(
    listRoutes(),
    JSResource.srcOfModuleId,
    router__loadEntryPoint,
    router__createAppFromEntryPoint,
    App,
    schema,
    () => new Context(),
    persistedQueries,
    manifest,
  );
}
