import {Pool} from 'pg';

export const authPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_CA_CERT
    ? {
        rejectUnauthorized: true,
        ca: process.env.DATABASE_CA_CERT,
      }
    : undefined,
});
