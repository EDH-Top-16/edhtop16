import {Pool} from 'pg';

export const authPool = new Pool({
  connectionString: process.env.AUTH_DATABASE_URL,
});
