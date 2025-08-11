import React, { useState } from 'react';
import { useSession } from '../lib/client/use_session';

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function LoginForm({ onSuccess, className = '' }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login({ username, password });
    console.log('Login result:', result); // Debug log

    setIsLoading(false);

    // Handle boolean return (true/false)
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
        <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 bg-[#312d5a] border border-[#514f86] rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          placeholder="Enter username"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-[#312d5a] border border-[#514f86] rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          placeholder="Enter password"
          required
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-sm"
        >
          Demo User
        </button>
      </div>

      <div className="text-xs text-gray-400 mt-2">
        <p>Demo credentials:</p>
        <p>Username: <code className="bg-[#312d5a] px-1 rounded">puguser</code></p>
        <p>Password: <code className="bg-[#312d5a] px-1 rounded">fakepug</code></p>
      </div>
    </form>
  );
}

interface UserProfileProps {
  className?: string;
}

export function UserProfile({ className = '' }: UserProfileProps) {
  const { 
    sessionData, 
    isAuthenticated, 
    isAdmin,
    logout 
  } = useSession();

  if (!isAuthenticated || !sessionData.userProfile) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  const userProfile = sessionData.userProfile;
  const username = sessionData.username;

  return (
    <div className={`bg-[#312d5a]/50 rounded-lg p-4 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">
          {userProfile.displayName}
          {isAdmin && <span className="ml-2 text-xs bg-yellow-600 text-black px-2 py-1 rounded">Admin</span>}
        </h3>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
        <div>
          <div className="text-white font-medium">Email</div>
          <div>{userProfile.email}</div>
        </div>
        
        <div>
          <div className="text-white font-medium">Favorite Commander</div>
          <div>{userProfile.favoriteCommander}</div>
        </div>
        
        <div>
          <div className="text-white font-medium">Member Since</div>
          <div>{new Date(userProfile.joinDate).toLocaleDateString()}</div>
        </div>
        
        <div>
          <div className="text-white font-medium">Total Games</div>
          <div>{userProfile.totalGames}</div>
        </div>
        
        <div className="col-span-2">
          <div className="text-white font-medium">Win Rate</div>
          <div className="flex items-center gap-2">
            <div className="bg-[#514f86] rounded-full h-2 flex-1">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${userProfile.winRate * 100}%` }}
              />
            </div>
            <span>{(userProfile.winRate * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}