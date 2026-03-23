import {RouteLink} from '#genfiles/router/router.jsx';
import {authClient} from '#src/lib/client/auth';

export function LoginButton() {
  const {data: session, isPending} = authClient.useSession();

  if (isPending) return null;

  if (session?.user) {
    return (
      <RouteLink
        className="text-sm text-white/60 underline decoration-transparent transition-colors hover:text-white hover:decoration-inherit"
        route="/profile"
        params={{}}
      >
        My Profile
      </RouteLink>
    );
  }

  return (
    <button
      className="text-sm text-white/60 underline decoration-transparent transition-colors hover:text-white hover:decoration-inherit"
      onClick={() =>
        authClient.signIn.social({provider: 'discord', callbackURL: '/'})
      }
    >
      Sign In
    </button>
  );
}
