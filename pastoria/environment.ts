import {getSchema} from '#genfiles/schema/schema.js';
import {Context} from '#src/lib/server/context';
import {PastoriaEnvironment} from '@pastoria/runtime/server';
import {GraphQLSchema, specifiedDirectives} from 'graphql';

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
