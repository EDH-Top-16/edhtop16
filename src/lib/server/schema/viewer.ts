import type {Context} from '../context.js';

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
  private ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  /** @gqlField */
  get name(): string | null {
    return this.ctx.user?.name ?? null;
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
