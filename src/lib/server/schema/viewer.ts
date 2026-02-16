import type {Context} from '../context.js';
import {profileDb} from '../profile_db.js';
import {Profile} from './profile.js';
import {Team} from './team.js';

export const ALLOWED_TEAM_CREATION = new Set(['aAJvwKsiyaeCG79ZsJtNIe59aTA3']);

/** @gqlEnum */
export enum DiscordRole {
  SUPPORTER = 'SUPPORTER',
  DEVELOPER = 'DEVELOPER',
  CONTRIBUTOR = 'CONTRIBUTOR',
}

const ROLE_ID_MAP: Record<string, DiscordRole> = {
  '1317633939917115475': DiscordRole.SUPPORTER,
  '1317980885403963395': DiscordRole.DEVELOPER,
  '1317981039590641744': DiscordRole.CONTRIBUTOR,
};

/** @gqlType */
export class Viewer {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  /** @gqlField */
  get name(): string | null {
    return this.ctx.user?.name ?? null;
  }

  /** @gqlField */
  get email(): string {
    return this.ctx.user!.email;
  }

  /** @gqlField */
  get image(): string | null {
    return this.ctx.user?.image ?? null;
  }

  /** @gqlField */
  async profile(): Promise<Profile | null> {
    const row = await profileDb
      .selectFrom('profile')
      .selectAll()
      .where('profile.userId', '=', this.ctx.user!.id)
      .executeTakeFirst();

    return row == null ? null : new Profile(row);
  }

  /** @gqlField */
  async canCreateTeam(): Promise<boolean> {
    const row = await profileDb
      .selectFrom('profile')
      .select(['topdeckProfile'])
      .where('profile.userId', '=', this.ctx.user!.id)
      .executeTakeFirst();

    return row != null && ALLOWED_TEAM_CREATION.has(row.topdeckProfile);
  }

  /** @gqlField */
  async ownedTeam(): Promise<Team | null> {
    const team = await profileDb
      .selectFrom('team')
      .selectAll()
      .where('ownerId', '=', this.ctx.user!.id)
      .executeTakeFirst();

    return team == null ? null : new Team(team);
  }

  /** @gqlField */
  async discordRoles(): Promise<DiscordRole[]> {
    const roleIds = await this.ctx.getDiscordRoles();
    return roleIds
      .map((id) => ROLE_ID_MAP[id])
      .filter((r): r is DiscordRole => r != null);
  }

  /** @gqlField */
  async hideAds(): Promise<boolean> {
    const roles = await this.discordRoles();
    return roles.length > 0;
  }
}

/** @gqlQueryField */
export function viewer(ctx: Context): Viewer | null {
  if (!ctx.user) return null;
  return new Viewer(ctx);
}
