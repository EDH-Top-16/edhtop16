import React, {useState} from 'react';
import {useSession} from '../lib/client/use_session';
import {LoginForm, UserProfile} from './login_form';

interface SessionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function SessionStatus({
  showDetails = false,
  className = '',
}: SessionStatusProps) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const {isAuthenticated, sessionData} = useSession();

  if (isAuthenticated) {
    return (
      <div className={`session-status ${className}`}>
        {showDetails ? (
          <UserProfile />
        ) : (
          <div className="text-sm text-green-400">
            Welcome,{' '}
            {sessionData.userProfile?.displayName || sessionData.username}!
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`session-status ${className}`}>
      {showLoginForm ? (
        <div className="rounded-lg bg-[#312d5a]/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-white">Login</h3>
            <button
              onClick={() => setShowLoginForm(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <LoginForm onSuccess={() => setShowLoginForm(false)} />
        </div>
      ) : (
        <button
          onClick={() => setShowLoginForm(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Login
        </button>
      )}
    </div>
  );
}
