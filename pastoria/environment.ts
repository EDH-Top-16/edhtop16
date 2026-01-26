import {getSchema} from '#genfiles/schema/schema.js';
import {Context} from '#src/lib/server/context.js';
import {PastoriaEnvironment} from 'pastoria-runtime/server';
import {GraphQLSchema, specifiedDirectives} from 'graphql';

// Grats generates schema with only custom directives, missing the built-in
// @include, @skip, etc. We need to add them back.
function getSchemaWithBuiltinDirectives(): GraphQLSchema {
  const schema = getSchema();
  return new GraphQLSchema({
    ...schema.toConfig(),
    directives: [...specifiedDirectives, ...schema.getDirectives()],
  });
}

export default new PastoriaEnvironment({
  schema: getSchemaWithBuiltinDirectives(),
  createContext: (req) => Context.createFromRequest(req),
  enableGraphiQLInProduction: true,
  persistedQueriesOnlyInProduction: false,
});
