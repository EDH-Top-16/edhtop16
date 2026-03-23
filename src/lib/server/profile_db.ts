import {Generated, Kysely, PostgresDialect} from 'kysely';
import {authPool} from './auth_db.js';

interface ProfileTable {
  id: Generated<string>;
  userId: string;
  topdeckProfile: string;
  offersCoaching: boolean;
  coachingBio: string | null;
  coachingBookingUrl: string | null;
  coachingRatePerHour: number | null;
  teamId: string | null;
}

interface TeamTable {
  id: Generated<string>;
  name: string;
  ownerId: string;
  members: string[] | null;
}

export interface ProfileDB {
  profile: ProfileTable;
  team: TeamTable;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const profileDb = new Kysely<ProfileDB>({
  dialect: new PostgresDialect({pool: authPool}),
});
