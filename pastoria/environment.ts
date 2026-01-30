import {getSchema} from '#genfiles/schema/schema.js';
import {GraphQLSchema, specifiedDirectives} from 'graphql';
import {PastoriaEnvironment} from 'pastoria-runtime/server';
import {Context} from '#src/lib/server/context';

const schemaConfig = getSchema().toConfig();
const schema = new GraphQLSchema({
  ...schemaConfig,
  directives: [...specifiedDirectives, ...schemaConfig.directives],
});

export default new PastoriaEnvironment({
  schema,
  createContext: (req) => Context.createFromRequest(req),
  enableGraphiQLInProduction: true,
  persistedQueriesOnlyInProduction: false,
});
