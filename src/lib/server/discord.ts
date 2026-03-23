import {auth} from './auth.js';

const EDHTOP16_GUILD_ID = '1317628921445089402';

interface DiscordGuildMember {
  roles: string[];
  nick?: string | null;
  joined_at: string;
}

/**
 * Fetches the user's roles in the EDHTop16 Discord server.
 * Returns an empty array if the user is not in the server or the token is
 * unavailable.
 */
export async function getDiscordGuildRoles(userId: string): Promise<string[]> {
  const {accessToken} = await auth.api.getAccessToken({
    body: {providerId: 'discord', userId},
  });

  if (!accessToken) return [];

  const res = await fetch(
    `https://discord.com/api/v10/users/@me/guilds/${EDHTOP16_GUILD_ID}/member`,
    {headers: {Authorization: `Bearer ${accessToken}`}},
  );

  if (!res.ok) return [];

  const member: DiscordGuildMember = await res.json();
  return member.roles;
}
