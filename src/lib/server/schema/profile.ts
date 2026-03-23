import {Float} from 'grats';
import type {Context} from '../context.js';
import {profileDb, type ProfileDB} from '../profile_db.js';
import type {Selectable} from 'kysely';
import {GraphQLNode} from './connection.js';
import {Team} from './team.js';
import {Viewer} from './viewer.js';

/** @gqlType */
export class Profile implements GraphQLNode {
  readonly id: string;
  readonly __typename = 'Profile' as const;

  /** @gqlField */
  readonly topdeckProfile: string;
  /** @gqlField */
  readonly offersCoaching: boolean;
  /** @gqlField */
  readonly coachingBio: string | null;
  /** @gqlField */
  readonly coachingBookingUrl: string | null;
  /** @gqlField */
  readonly coachingRatePerHour: Float | null;
  readonly teamId: string | null;

  constructor(profile: Selectable<ProfileDB['profile']>) {
    this.id = profile.id;
    this.topdeckProfile = profile.topdeckProfile;
    this.offersCoaching = profile.offersCoaching;
    this.coachingBio = profile.coachingBio;
    this.coachingBookingUrl = profile.coachingBookingUrl;
    this.coachingRatePerHour = profile.coachingRatePerHour;
    this.teamId = profile.teamId;
  }

  /** @gqlField */
  async name(ctx: Context): Promise<string | null> {
    const {name} = await ctx.topdeckClient.players.load(this.topdeckProfile);
    return name ?? null;
  }

  /** @gqlField */
  async username(ctx: Context): Promise<string | null> {
    const {username} = await ctx.topdeckClient.players.load(
      this.topdeckProfile,
    );
    return username ?? null;
  }

  /** @gqlField */
  async profileImage(ctx: Context): Promise<string> {
    const {profileImage} = await ctx.topdeckClient.players.load(
      this.topdeckProfile,
    );
    return profileImage ?? 'https://topdeck.gg/img/logo/TopDeckLogoBorder.png';
  }

  /** @gqlField */
  async team(): Promise<Team | null> {
    if (this.teamId == null) return null;

    const team = await profileDb
      .selectFrom('team')
      .selectAll()
      .where('id', '=', this.teamId)
      .executeTakeFirstOrThrow();

    return new Team(team);
  }

  /** @gqlField */
  async selectableTeams(): Promise<Team[]> {
    const teams = await profileDb
      .selectFrom('team')
      .selectAll()
      .where((eb) => eb(eb.val(this.topdeckProfile), '=', eb.fn.any('members')))
      .execute();

    return teams.map((t) => new Team(t));
  }
}

/** @gqlType */
interface ClaimProfileResponse {
  /** @gqlField */
  success: boolean;
  /** @gqlField */
  error?: string;
  /** @gqlField */
  viewer?: Viewer;
}

/** @gqlMutationField */
export async function claimProfile(
  ctx: Context,
  profileUrl: string,
): Promise<ClaimProfileResponse> {
  if (ctx.user == null) {
    return {
      success: false,
      error: 'Must be authenticated to claim a topdeck profile.',
    };
  }

  const topdeckId = profileUrl.replace('https://topdeck.gg/profile/', '');
  const topdeckProfile = await ctx.topdeckClient.players.load(topdeckId);
  const authAccounts = await ctx.listUserAccounts();

  const isSameAccount =
    topdeckProfile.discordId &&
    authAccounts.some(
      (account) => account.accountId === `${topdeckProfile.discordId}`,
    );

  if (!isSameAccount) {
    return {
      success: false,
      error: 'Discord account ID did not match account linked with Topdeck.',
    };
  }

  await profileDb
    .insertInto('profile')
    .values({
      topdeckProfile: topdeckProfile.id,
      userId: ctx.user.id,
      offersCoaching: false,
    })
    .execute();

  return {
    success: true,
    viewer: new Viewer(ctx),
  };
}

/** @gqlMutationField */
export async function deleteProfile(
  ctx: Context,
): Promise<ClaimProfileResponse> {
  if (!ctx.user) {
    return {success: false, error: 'Must be logged in.'};
  }

  await profileDb
    .deleteFrom('profile')
    .where('userId', '=', ctx.user.id)
    .execute();

  return {success: true, viewer: new Viewer(ctx)};
}

/** @gqlInput */
interface CoachingInfoInput {
  offersCoaching: boolean;
  coachingBio: string | null;
  coachingBookingUrl: string | null;
  coachingRatePerHour: Float | null;
}

/** @gqlType */
interface CoachingInfoResponse {
  /** @gqlField */
  profile: Profile | null;
}

/** @gqlMutationField */
export async function updateCoachingInfo(
  ctx: Context,
  coachingInfo: CoachingInfoInput,
): Promise<CoachingInfoResponse> {
  if (!ctx.user) {
    throw new Error('Must be authenticated to update profile info!');
  }

  const updatedProfile = await profileDb
    .updateTable('profile')
    .set(coachingInfo)
    .where('userId', '=', ctx.user.id)
    .returningAll()
    .executeTakeFirst();

  return {
    profile: updatedProfile == null ? null : new Profile(updatedProfile),
  };
}
