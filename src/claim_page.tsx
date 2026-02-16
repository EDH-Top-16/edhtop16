import {claimPage_ClaimProfileMutation} from '#genfiles/queries/claimPage_ClaimProfileMutation.graphql.js';
import {claimPage_ClaimProfileQuery} from '#genfiles/queries/claimPage_ClaimProfileQuery.graphql.js';
import {claimPage_CoachingInfoCard$key} from '#genfiles/queries/claimPage_CoachingInfoCard.graphql.js';
import {claimPage_CreateTeamMutation} from '#genfiles/queries/claimPage_CreateTeamMutation.graphql.js';
import {claimPage_DeleteProfileMutation} from '#genfiles/queries/claimPage_DeleteProfileMutation.graphql.js';
import {claimPage_DeleteTeamMutation} from '#genfiles/queries/claimPage_DeleteTeamMutation.graphql.js';
import {claimPage_DiscordAuthCard$key} from '#genfiles/queries/claimPage_DiscordAuthCard.graphql.js';
import {claimPage_TeamCard$key} from '#genfiles/queries/claimPage_TeamCard.graphql.js';
import {claimPage_TopdeckProfileCard$key} from '#genfiles/queries/claimPage_TopdeckProfileCard.graphql.js';
import {claimPage_UpdateCoachingProfileMutation} from '#genfiles/queries/claimPage_UpdateCoachingProfileMutation.graphql.js';
import {claimPage_LeaveTeamMutation} from '#genfiles/queries/claimPage_LeaveTeamMutation.graphql.js';
import {claimPage_JoinTeamMutation} from '#genfiles/queries/claimPage_JoinTeamMutation.graphql.js';
import {claimPage_AddTeamMemberMutation} from '#genfiles/queries/claimPage_AddTeamMemberMutation.graphql.js';
import {claimPage_RemoveTeamMemberMutation} from '#genfiles/queries/claimPage_RemoveTeamMemberMutation.graphql.js';
import {useCallback, useMemo, useState} from 'react';
import {
  EntryPointComponent,
  graphql,
  useFragment,
  useMutation,
  usePreloadedQuery,
} from 'react-relay';
import {z} from 'zod/v4';
import {Button} from '#src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#src/components/ui/card_ui';
import {Checkbox} from '#src/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#src/components/ui/dialog';
import {Input} from '#src/components/ui/input';
import {Label} from '#src/components/ui/label';
import {Textarea} from '#src/components/ui/textarea';
import {authClient} from '#src/lib/client/auth';
import {cn} from '#src/lib/utils';
import {Navigation} from './components/navigation';

const topdeckProfileUrlSchema = z
  .url()
  .startsWith('https://topdeck.gg/profile/');

/** @resource m#claim_page */
export const ClaimPage: EntryPointComponent<
  {claimQuery: claimPage_ClaimProfileQuery},
  {}
> = ({queries}) => {
  const query = usePreloadedQuery(
    graphql`
      query claimPage_ClaimProfileQuery @preloadable {
        ...claimPage_DiscordAuthCard
        viewer {
          ...claimPage_TopdeckProfileCard
          ...claimPage_TeamCard
          profile {
            ...claimPage_CoachingInfoCard
          }
        }
      }
    `,
    queries.claimQuery,
  );

  return (
    <>
      <Navigation />
      <div className="flex flex-col gap-8 p-8">
        <h1 className="font-title text-4xl font-bold">My Profile</h1>
        <div className="grid gap-4 sm:container md:grid-cols-2 lg:grid-cols-3">
          <DiscordAuthCard query={query} />
          {query.viewer && <TopdeckProfileCard user={query.viewer} />}
          {query.viewer?.profile && (
            <CoachingInfoCard profile={query.viewer.profile} />
          )}
          {query.viewer && <TeamCard user={query.viewer} />}
        </div>
      </div>
    </>
  );
};

function DiscordAuthCard(props: {query: claimPage_DiscordAuthCard$key}) {
  const {viewer} = useFragment(
    graphql`
      fragment claimPage_DiscordAuthCard on Query {
        viewer {
          email
          image
        }
      }
    `,
    props.query,
  );

  function login() {
    authClient.signIn.social({
      provider: 'discord',
      callbackURL: '/',
    });
  }

  function logout() {
    authClient.signOut().then(() => {
      window.location.reload();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-title">Discord Account</CardTitle>
        <CardDescription>
          Sign in with Discord to claim your EDHTop16 profile.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {viewer == null ? (
          <Button variant="outline" onClick={login}>
            <svg
              className="h-5 w-5"
              viewBox="0 -28.5 256 256"
              fill="currentColor"
            >
              <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z" />
            </svg>
            Sign in
          </Button>
        ) : (
          <div className="flex w-full flex-col items-center">
            {viewer.image && (
              <img
                className="h-16 w-16 rounded-full border-2"
                src={viewer.image}
              />
            )}

            <div className="pt-2 text-sm text-gray-300">{viewer.email}</div>

            <Button variant="ghost" className="mt-4" onClick={logout}>
              Sign out
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TopdeckProfileCard(props: {user: claimPage_TopdeckProfileCard$key}) {
  const {profile} = useFragment(
    graphql`
      fragment claimPage_TopdeckProfileCard on Viewer @throwOnFieldError {
        profile {
          id
          name
          username
          topdeckProfile
          profileImage
          offersCoaching
        }
      }
    `,
    props.user,
  );

  const [deleteProfile, isDeleting] =
    useMutation<claimPage_DeleteProfileMutation>(graphql`
      mutation claimPage_DeleteProfileMutation {
        deleteProfile {
          success
          error
          viewer {
            ...claimPage_TopdeckProfileCard
          }
        }
      }
    `);

  const handleDelete = useCallback(() => {
    deleteProfile({variables: {}});
  }, [deleteProfile]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-title">TopDeck Profile</CardTitle>
        <CardDescription>
          Connect your Topdeck profile to customize results on EDHTop16.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {profile == null ? (
          <ClaimProfileForm />
        ) : (
          <div className="flex w-full flex-col items-center">
            <img
              className="h-16 w-16 rounded-full border-2"
              src={profile.profileImage}
            />

            <a
              href={'https://topdeck.gg/profile/' + profile.topdeckProfile}
              className="pt-2 text-sm text-gray-300"
            >
              {profile.name}
              {!!profile.username && <>&nbsp;({profile.username})</>}
            </a>

            <Button
              variant="destructive"
              className="mt-4"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Remove
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ClaimProfileForm() {
  const [claimProfile, isClaiming] =
    useMutation<claimPage_ClaimProfileMutation>(graphql`
      mutation claimPage_ClaimProfileMutation($topdeckProfileUrl: String!) {
        claimProfile(profileUrl: $topdeckProfileUrl) {
          success
          error
          viewer {
            ...claimPage_TopdeckProfileCard
            ...claimPage_TeamCard
            profile {
              ...claimPage_CoachingInfoCard
            }
          }
        }
      }
    `);

  const [profileUrl, setProfileUrl] = useState('');
  const profileUrlError = useMemo(() => {
    return topdeckProfileUrlSchema.safeParse(profileUrl).error;
  }, [profileUrl]);

  const [handleClaimError, setHandleClaimError] = useState('');
  const handleClaim = useCallback(() => {
    claimProfile({
      variables: {topdeckProfileUrl: profileUrl},
      onCompleted: (res) => {
        if (res.claimProfile?.error) {
          setHandleClaimError(res.claimProfile.error);
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  }, [claimProfile, profileUrl]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <Input
          placeholder="E.g. https://topdeck.gg/profile/1234"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
        />

        <Button
          variant="outline"
          disabled={profileUrlError != null || isClaiming}
          onClick={handleClaim}
        >
          Claim
        </Button>
      </div>

      {handleClaimError && (
        <span className="mt-1 text-xs text-red-600">{handleClaimError}</span>
      )}

      {profileUrl && profileUrlError?.issues[0] != null && (
        <span className="mt-1 text-xs text-red-600">
          {profileUrlError.issues[0].message}
        </span>
      )}
    </div>
  );
}

function CoachingInfoCard(props: {profile: claimPage_CoachingInfoCard$key}) {
  const profile = useFragment(
    graphql`
      fragment claimPage_CoachingInfoCard on Profile @throwOnFieldError {
        offersCoaching
        coachingBio
        coachingBookingUrl
        coachingRatePerHour
      }
    `,
    props.profile,
  );

  const [updateCoachingProfile, isUpdating] =
    useMutation<claimPage_UpdateCoachingProfileMutation>(graphql`
      mutation claimPage_UpdateCoachingProfileMutation(
        $coachingInfo: CoachingInfoInput!
      ) {
        updateCoachingInfo(coachingInfo: $coachingInfo) {
          profile {
            ...claimPage_CoachingInfoCard
          }
        }
      }
    `);

  const [offersCoaching, setOffersCoaching] = useState(profile.offersCoaching);
  const [bookingUrl, setBookingUrl] = useState(
    profile.coachingBookingUrl ?? '',
  );
  const [hourlyRate, setHourlyRate] = useState(
    profile.coachingRatePerHour ? `${profile.coachingRatePerHour}` : '',
  );
  const [coachingBio, setCoachingBio] = useState(profile.coachingBio ?? '');

  const handleUpdate = useCallback(() => {
    updateCoachingProfile({
      variables: {
        coachingInfo: {
          offersCoaching,
          coachingBio,
          coachingBookingUrl: bookingUrl,
          coachingRatePerHour: Number(hourlyRate),
        },
      },
    });
  }, [
    updateCoachingProfile,
    offersCoaching,
    coachingBio,
    bookingUrl,
    hourlyRate,
  ]);

  return (
    <Card className="row-span-2">
      <CardHeader>
        <CardTitle className="font-title">Coaching</CardTitle>
        <CardDescription>
          Advertise your coaching availability with your results on EDHTop16.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Checkbox
              id="offers-coaching"
              checked={offersCoaching}
              onCheckedChange={(checked) => setOffersCoaching(!!checked)}
            />
            <Label htmlFor="offers-coaching">
              I am currently offering coaching
            </Label>
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label
              htmlFor="coaching-booking-url"
              className={cn(!offersCoaching && 'opacity-30')}
            >
              Booking URL
            </Label>
            <Input
              id="coaching-booking-url"
              disabled={!offersCoaching}
              placeholder="Discord, Calendly, etc."
              value={bookingUrl}
              onChange={(e) => setBookingUrl(e.target.value)}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label
              htmlFor="coaching-rate-per-hour"
              className={cn(!offersCoaching && 'opacity-30')}
            >
              Hourly Rate ($)
            </Label>
            <Input
              id="coaching-rate-per-hour"
              type="number"
              disabled={!offersCoaching}
              placeholder="$10 – $50"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>

          <div className="grid w-full gap-3">
            <Label
              htmlFor="coaching-bio"
              className={cn(!offersCoaching && 'opacity-30')}
            >
              Bio
            </Label>
            <Textarea
              id="coaching-bio"
              disabled={!offersCoaching}
              placeholder="Why you would make an excellent coach."
              className="h-32 resize-none"
              value={coachingBio}
              onChange={(e) => setCoachingBio(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamCard(props: {user: claimPage_TeamCard$key}) {
  const {canCreateTeam, ownedTeam, profile} = useFragment(
    graphql`
      fragment claimPage_TeamCard on Viewer @throwOnFieldError {
        canCreateTeam

        ownedTeam {
          id
          name
          invites {
            topdeckProfile
            name
            username
            profileImage
            joined
          }
        }

        profile {
          topdeckProfile
          selectableTeams {
            id
            name
          }

          team {
            name
          }
        }
      }
    `,
    props.user,
  );

  const [deleteTeam, isDeleting] = useMutation<claimPage_DeleteTeamMutation>(
    graphql`
      mutation claimPage_DeleteTeamMutation($teamId: String!) {
        deleteTeam(teamId: $teamId) {
          owner {
            ...claimPage_TeamCard
          }
        }
      }
    `,
  );

  const handleDelete = useCallback(() => {
    if (ownedTeam == null) return;
    deleteTeam({
      variables: {teamId: ownedTeam.id},
    });
  }, [deleteTeam, ownedTeam]);

  const [leaveTeam, isLeaving] = useMutation<claimPage_LeaveTeamMutation>(
    graphql`
      mutation claimPage_LeaveTeamMutation {
        removeSelfFromTeam {
          profile {
            team {
              name
            }
          }
        }
      }
    `,
  );

  const handleLeaveTeam = useCallback(() => {
    leaveTeam({variables: {}});
  }, [leaveTeam]);

  const [joinTeam, isJoining] = useMutation<claimPage_JoinTeamMutation>(graphql`
    mutation claimPage_JoinTeamMutation($teamId: String!) {
      selectTeam(teamId: $teamId) {
        profile {
          team {
            name
          }
        }
      }
    }
  `);

  const handleJoinTeam = useCallback(
    (teamId: string) => {
      joinTeam({variables: {teamId}});
    },
    [joinTeam],
  );

  const [addMember, isAddingMember] =
    useMutation<claimPage_AddTeamMemberMutation>(graphql`
      mutation claimPage_AddTeamMemberMutation(
        $teamId: String!
        $profileUrl: String!
      ) {
        addTeamMember(teamId: $teamId, profileUrl: $profileUrl) {
          team {
            id
            invites {
              topdeckProfile
              name
              username
              profileImage
              joined
            }
          }
        }
      }
    `);

  const [removeMember, isRemovingMember] =
    useMutation<claimPage_RemoveTeamMemberMutation>(graphql`
      mutation claimPage_RemoveTeamMemberMutation(
        $teamId: String!
        $topdeckProfileId: String!
      ) {
        removeTeamMember(teamId: $teamId, topdeckProfileId: $topdeckProfileId) {
          team {
            id
            invites {
              topdeckProfile
              name
              username
              profileImage
              joined
            }
          }
        }
      }
    `);

  const handleRemoveMember = useCallback(
    (topdeckProfileId: string) => {
      if (ownedTeam == null) return;
      removeMember({
        variables: {teamId: ownedTeam.id, topdeckProfileId},
      });
    },
    [removeMember, ownedTeam],
  );

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="font-title">Team</CardTitle>
        <CardDescription>Showcase your playgroup on EDHTop16.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center gap-4 pt-4">
          {ownedTeam != null ? (
            <>
              <span className="max-w-sm text-center text-sm">
                You are the owner of {ownedTeam.name}.
              </span>
              <div className="w-full">
                <h3 className="mb-3 text-center text-sm font-semibold">
                  Invited Members
                </h3>
                <div className="flex flex-col gap-2">
                  {ownedTeam.invites.map((invite) => {
                    const isOwner =
                      profile?.topdeckProfile === invite.topdeckProfile;
                    return (
                      <div
                        key={invite.topdeckProfile}
                        className="flex items-center justify-between rounded-md border border-gray-700 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            className="h-10 w-10 rounded-full border"
                            src={invite.profileImage}
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {invite.name}
                              </span>
                              {isOwner && (
                                <span className="rounded-full bg-blue-900/50 px-2 py-0.5 text-xs text-blue-300">
                                  Owner
                                </span>
                              )}
                              {invite.joined ? (
                                <span className="rounded-full bg-green-900/50 px-2 py-0.5 text-xs text-green-300">
                                  Joined
                                </span>
                              ) : (
                                <span className="rounded-full bg-yellow-900/50 px-2 py-0.5 text-xs text-yellow-300">
                                  Pending
                                </span>
                              )}
                            </div>
                            {invite.username && (
                              <span className="text-xs text-gray-400">
                                {invite.username}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveMember(invite.topdeckProfile)
                          }
                          disabled={isRemovingMember || isOwner}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <AddTeamMemberDialog
                  teamId={ownedTeam.id}
                  onAddMember={addMember}
                  isAdding={isAddingMember}
                />
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  Delete Team
                </Button>
              </div>
            </>
          ) : profile?.team != null ? (
            <>
              <span className="max-w-sm text-center text-sm">
                You are a member of {profile.team.name}.
              </span>

              <Button
                variant="destructive"
                onClick={handleLeaveTeam}
                disabled={isLeaving}
              >
                Leave Team
              </Button>
            </>
          ) : profile?.selectableTeams.length ? (
            <>
              <h2>Join a team</h2>
              <div className="flex gap-2">
                {profile.selectableTeams.map((t) => {
                  return (
                    <div key={t.id} className="flex">
                      <Button
                        variant="outline"
                        disabled={isJoining}
                        onClick={() => {
                          handleJoinTeam(t.id);
                        }}
                      >
                        {t.name}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : canCreateTeam ? (
            <CreateTeamDialog />
          ) : (
            <span className="text-sm text-gray-500">Check back later!</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CreateTeamDialog() {
  const [createTeam, isCreating] = useMutation<claimPage_CreateTeamMutation>(
    graphql`
      mutation claimPage_CreateTeamMutation($team: CreateTeamInput!) {
        createTeam(team: $team) {
          owner {
            ...claimPage_TeamCard
          }
        }
      }
    `,
  );

  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState('');

  const handleCreate = useCallback(() => {
    createTeam({
      variables: {team: {name: teamName, memberProfileUrls: members}},
    });
  }, [createTeam, teamName, members]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create a team</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New team</DialogTitle>
          <DialogDescription>
            Teams allow you to show off your playgroup's results across
            EDHTop16. Each player can only be a member of at most one team.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="team-name">Team name</Label>
            <Input
              id="team-name"
              placeholder="Le Cable"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="team-profile-urls">Members</Label>
            <Textarea
              id="team-profile-urls"
              placeholder="Topdeck profile URLs of team members. One per line."
              value={members}
              onChange={(e) => setMembers(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isCreating}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleCreate} disabled={isCreating || !teamName}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddTeamMemberDialog(props: {
  teamId: string;
  onAddMember: (args: {
    variables: {teamId: string; profileUrl: string};
  }) => void;
  isAdding: boolean;
}) {
  const [profileUrl, setProfileUrl] = useState('');
  const profileUrlError = useMemo(() => {
    return topdeckProfileUrlSchema.safeParse(profileUrl).error;
  }, [profileUrl]);

  const handleAdd = useCallback(() => {
    props.onAddMember({
      variables: {teamId: props.teamId, profileUrl},
    });
    setProfileUrl('');
  }, [props, profileUrl]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Member</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your team by providing their Topdeck profile
            URL.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="member-profile-url">Topdeck Profile URL</Label>
            <Input
              id="member-profile-url"
              placeholder="https://topdeck.gg/profile/..."
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
            />
            {profileUrl && profileUrlError?.issues[0] != null && (
              <span className="text-xs text-red-600">
                {profileUrlError.issues[0].message}
              </span>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={props.isAdding}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleAdd}
              disabled={props.isAdding || profileUrlError != null}
            >
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
