import {betterAuth} from 'better-auth';
import {authPool} from './auth_db.js';

export const auth = betterAuth({
  database: authPool,
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      scope: ['identify', 'email', 'guilds.members.read'],
    },
  },
});
