import type {Selectable} from 'kysely';
import type {Context} from '../context.js';
import {profileDb, type ProfileDB} from '../profile_db.js';
import {GraphQLNode} from './connection.js';
import {Profile} from './profile.js';
import {Viewer} from './viewer.js';
import {fromGlobalId} from 'graphql-relay';

/** @gqlType */
export class TeamMemberInvite {
  topdeckProfileId: string;
  hasJoined: boolean;
  profile: Profile | null;

  constructor(topdeckProfileId: string, profile: Profile | null) {
    this.topdeckProfileId = topdeckProfileId;
    this.profile = profile;
    this.hasJoined = profile != null;
  }

  /** @gqlField */
  async topdeckProfile(ctx: Context): Promise<string> {
    const topdeckProfile = await ctx.topdeckClient.players.load(
      this.topdeckProfileId,
    );
    return topdeckProfile.id;
  }

  /** @gqlField */
  async name(ctx: Context): Promise<string | null> {
    const topdeckProfile = await ctx.topdeckClient.players.load(
      this.topdeckProfileId,
    );
    return topdeckProfile.name ?? null;
  }

  /** @gqlField */
  async username(ctx: Context): Promise<string | null> {
    const topdeckProfile = await ctx.topdeckClient.players.load(
      this.topdeckProfileId,
    );
    return topdeckProfile.username ?? null;
  }

  /** @gqlField */
  async profileImage(ctx: Context): Promise<string> {
    const topdeckProfile = await ctx.topdeckClient.players.load(
      this.topdeckProfileId,
    );
    return (
      topdeckProfile.profileImage ??
      'https://topdeck.gg/img/logo/TopDeckLogoBorder.png'
    );
  }

  /** @gqlField */
  joined(): boolean {
    return this.hasJoined;
  }

  /** @gqlField */
  joinedProfile(): Profile | null {
    return this.profile;
  }
}

/** @gqlType */
export class Team implements GraphQLNode {
  readonly id: string;
  readonly __typename = 'Team' as const;

  /** @gqlField */
  readonly name: string;
  readonly ownerId: string;
  readonly invitedMembers: string[];

  constructor(team: Selectable<ProfileDB['team']>) {
    this.id = team.id;
    this.name = team.name;
    this.ownerId = team.ownerId;
    this.invitedMembers = team.members ?? [];
  }

  /** @gqlField */
  async members(): Promise<Profile[]> {
    const members = await profileDb
      .selectFrom('profile')
      .selectAll()
      .where('teamId', '=', this.id)
      .execute();

    return members.map((m) => new Profile(m));
  }

  /** @gqlField */
  async invites(): Promise<TeamMemberInvite[]> {
    const joinedProfiles = await profileDb
      .selectFrom('profile')
      .selectAll()
      .where('teamId', '=', this.id)
      .execute();

    const joinedProfilesMap = new Map(
      joinedProfiles.map((p) => [p.topdeckProfile, new Profile(p)]),
    );

    return this.invitedMembers.map((topdeckId) => {
      return new TeamMemberInvite(
        topdeckId,
        joinedProfilesMap.get(topdeckId) ?? null,
      );
    });
  }

  /** @gqlField */
  async isOwner(ctx: Context): Promise<boolean> {
    return ctx.user?.id === this.ownerId;
  }
}

/** @gqlInput */
export interface CreateTeamInput {
  name: string;
  memberProfileUrls: string;
}

/** @gqlType */
export interface CreateTeamResponse {
  /** @gqlField */
  owner: Viewer;
}

/** @gqlMutationField */
export async function createTeam(
  ctx: Context,
  team: CreateTeamInput,
): Promise<CreateTeamResponse> {
  if (!ctx.user) {
    throw new Error('Must be authenticated to create team!');
  }

  const profile = await profileDb
    .selectFrom('profile')
    .selectAll()
    .where('userId', '=', ctx.user.id)
    .executeTakeFirstOrThrow();

  const allowedMemberProfiles = await ctx.topdeckClient.players.loadMany(
    team.memberProfileUrls
      .split('\n')
      .filter(Boolean)
      .map((m) => m.trim().replace('https://topdeck.gg/profile/', '')),
  );

  const allowedMemberProfileIds = new Set<string>([profile.topdeckProfile]);
  for (const topdeckProfile of allowedMemberProfiles) {
    if (topdeckProfile instanceof Error) {
      console.error(topdeckProfile);
    } else {
      allowedMemberProfileIds.add(topdeckProfile.id);
    }
  }

  await profileDb.transaction().execute(async (tx) => {
    const createdTeam = await tx
      .insertInto('team')
      .values({
        name: team.name,
        ownerId: ctx.user!.id,
        members: Array.from(allowedMemberProfileIds),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await tx
      .updateTable('profile')
      .set({teamId: createdTeam.id})
      .where('userId', '=', ctx.user!.id)
      .execute();
  });

  return {owner: new Viewer(ctx)};
}

/** @gqlType */
export interface UpdateProfileResponse {
  /** @gqlField */
  profile: Profile;
}

/** @gqlMutationField */
export async function selectTeam(
  ctx: Context,
  teamId: string,
): Promise<UpdateProfileResponse> {
  const {id: teamUuid} = fromGlobalId(teamId);

  if (!ctx.user) {
    throw new Error('Must be authenticated to add self to team!');
  }

  const team = await profileDb
    .selectFrom('team')
    .select('members')
    .where('id', '=', teamUuid)
    .executeTakeFirstOrThrow();

  const userProfile = await profileDb
    .selectFrom('profile')
    .select('topdeckProfile')
    .where('userId', '=', ctx.user.id)
    .executeTakeFirstOrThrow();

  const allowedMembers = new Set(team.members ?? []);
  if (!allowedMembers.has(userProfile.topdeckProfile)) {
    throw new Error('Cannot add self to team, not invited :(');
  }

  const updatedProfile = await profileDb
    .updateTable('profile')
    .set({teamId: teamUuid})
    .where('userId', '=', ctx.user.id)
    .returningAll()
    .executeTakeFirstOrThrow();

  return {profile: new Profile(updatedProfile)};
}

/** @gqlMutationField */
export async function removeSelfFromTeam(
  ctx: Context,
): Promise<UpdateProfileResponse> {
  if (!ctx.user) {
    throw new Error('Must be authenticated to remove self from team!');
  }

  const updatedProfile = await profileDb
    .updateTable('profile')
    .set({teamId: null})
    .where('userId', '=', ctx.user.id)
    .returningAll()
    .executeTakeFirstOrThrow();

  return {profile: new Profile(updatedProfile)};
}

/** @gqlMutationField */
export async function deleteTeam(
  ctx: Context,
  teamId: string,
): Promise<CreateTeamResponse> {
  const {id: teamUuid} = fromGlobalId(teamId);

  if (!ctx.user) {
    throw new Error('Must be authenticated to delete team!');
  }

  const team = await profileDb
    .selectFrom('team')
    .selectAll()
    .where('id', '=', teamUuid)
    .executeTakeFirstOrThrow();

  if (team.ownerId !== ctx.user.id) {
    throw new Error('Must own the team to be able to delete it!');
  }

  await profileDb.transaction().execute(async (tx) => {
    await tx
      .updateTable('profile')
      .set({teamId: null})
      .where('teamId', '=', teamUuid)
      .execute();

    await tx.deleteFrom('team').where('id', '=', teamUuid).execute();
  });

  return {owner: new Viewer(ctx)};
}

/** @gqlType */
export interface TeamMemberResponse {
  /** @gqlField */
  team: Team;
}

/** @gqlMutationField */
export async function addTeamMember(
  ctx: Context,
  teamId: string,
  profileUrl: string,
): Promise<TeamMemberResponse> {
  const {id: teamUuid} = fromGlobalId(teamId);

  if (!ctx.user) {
    throw new Error('Must be authenticated to add team members!');
  }

  const team = await profileDb
    .selectFrom('team')
    .selectAll()
    .where('id', '=', teamUuid)
    .executeTakeFirstOrThrow();

  if (team.ownerId !== ctx.user.id) {
    throw new Error('Must own the team to add members!');
  }

  const topdeckId = profileUrl
    .trim()
    .replace('https://topdeck.gg/profile/', '');
  const topdeckProfile = await ctx.topdeckClient.players.load(topdeckId);

  if (topdeckProfile instanceof Error) {
    throw new Error('Invalid Topdeck profile URL');
  }

  const existingMembers = new Set(team.members ?? []);
  existingMembers.add(topdeckProfile.id);

  const updatedTeam = await profileDb
    .updateTable('team')
    .set({members: Array.from(existingMembers)})
    .where('id', '=', teamUuid)
    .returningAll()
    .executeTakeFirstOrThrow();

  return {team: new Team(updatedTeam)};
}

/** @gqlMutationField */
export async function removeTeamMember(
  ctx: Context,
  teamId: string,
  topdeckProfileId: string,
): Promise<TeamMemberResponse> {
  const {id: teamUuid} = fromGlobalId(teamId);

  if (!ctx.user) {
    throw new Error('Must be authenticated to remove team members!');
  }

  const team = await profileDb
    .selectFrom('team')
    .selectAll()
    .where('id', '=', teamUuid)
    .executeTakeFirstOrThrow();

  if (team.ownerId !== ctx.user.id) {
    throw new Error('Must own the team to remove members!');
  }

  const ownerProfile = await profileDb
    .selectFrom('profile')
    .select('topdeckProfile')
    .where('userId', '=', ctx.user.id)
    .executeTakeFirst();

  if (ownerProfile?.topdeckProfile === topdeckProfileId) {
    throw new Error('Team owners cannot remove themselves from the team!');
  }

  await profileDb.transaction().execute(async (tx) => {
    await tx
      .updateTable('profile')
      .set({teamId: null})
      .where('topdeckProfile', '=', topdeckProfileId)
      .where('teamId', '=', teamUuid)
      .execute();

    const existingMembers = new Set(team.members ?? []);
    existingMembers.delete(topdeckProfileId);

    await tx
      .updateTable('team')
      .set({members: Array.from(existingMembers)})
      .where('id', '=', teamUuid)
      .execute();
  });

  const updatedTeam = await profileDb
    .selectFrom('team')
    .selectAll()
    .where('id', '=', teamUuid)
    .executeTakeFirstOrThrow();

  return {team: new Team(updatedTeam)};
}
