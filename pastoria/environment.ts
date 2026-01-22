import {getSchema} from '#genfiles/schema/schema.js';
import {Context} from '#src/lib/server/context.js';
import {PastoriaEnvironment} from 'pastoria-runtime/server';

export default new PastoriaEnvironment({
  schema: getSchema(),
  createContext: (req) => Context.createFromRequest(req),
  enableGraphiQLInProduction: true,
  persistedQueriesOnlyInProduction: false,
});
