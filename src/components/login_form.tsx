import React, {useState} from 'react';
import {useSession} from '../lib/client/use_session';

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function LoginForm({onSuccess, className = ''}: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {login} = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login({username, password});
    //console.log('Login result:', result);

    setIsLoading(false);

    if (result === true) {
      setUsername('');
      setPassword('');
      onSuccess?.();
    } else {
      setError('Login failed - invalid credentials');
    }
  };

  const fillDemoCredentials = () => {
    setUsername('puguser');
    setPassword('fakepug');
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label
          htmlFor="username"
          className="mb-1 block text-sm font-medium text-white"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded border border-[#514f86] bg-[#312d5a] px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          placeholder="Enter username"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-white"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-[#514f86] bg-[#312d5a] px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          placeholder="Enter password"
          required
        />
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={fillDemoCredentials}
          className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
        >
          Demo User
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        <p>Demo credentials:</p>
        <p>
          Username: <code className="rounded bg-[#312d5a] px-1">puguser</code>
        </p>
        <p>
          Password: <code className="rounded bg-[#312d5a] px-1">fakepug</code>
        </p>
      </div>
    </form>
  );
}

interface UserProfileProps {
  className?: string;
}

export function UserProfile({className = ''}: UserProfileProps) {
  const {sessionData, isAuthenticated, isAdmin, logout} = useSession();

  if (!isAuthenticated || !sessionData.userProfile) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  const userProfile = sessionData.userProfile;
  const username = sessionData.username;

  return (
    <div className={`space-y-3 rounded-lg bg-[#312d5a]/50 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">
          {userProfile.displayName}
          {isAdmin && (
            <span className="ml-2 rounded bg-yellow-600 px-2 py-1 text-xs text-black">
              Admin
            </span>
          )}
        </h3>
        <button
          onClick={handleLogout}
          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
        <div>
          <div className="font-medium text-white">Email</div>
          <div>{userProfile.email}</div>
        </div>

        <div>
          <div className="font-medium text-white">Favorite Commander</div>
          <div>{userProfile.favoriteCommander}</div>
        </div>

        <div>
          <div className="font-medium text-white">Member Since</div>
          <div>{new Date(userProfile.joinDate).toLocaleDateString()}</div>
        </div>

        <div>
          <div className="font-medium text-white">Total Games</div>
          <div>{userProfile.totalGames}</div>
        </div>

        <div className="col-span-2">
          <div className="font-medium text-white">Win Rate</div>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-[#514f86]">
              <div
                className="h-2 rounded-full bg-green-500 transition-all"
                style={{width: `${userProfile.winRate * 100}%`}}
              />
            </div>
            <span>{(userProfile.winRate * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
