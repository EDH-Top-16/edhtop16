import React, { useState } from 'react';
import { useSession } from '../lib/client/use_session';
import { LoginForm, UserProfile } from './login_form';

interface SessionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function SessionStatus({ showDetails = false, className = '' }: SessionStatusProps) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { isAuthenticated, sessionData } = useSession();

  if (isAuthenticated) {
    return (
      <div className={`session-status ${className}`}>
        {showDetails ? (
          <UserProfile />
        ) : (
          <div className="text-sm text-green-400">
            Welcome, {sessionData.userProfile?.displayName || sessionData.username}!
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`session-status ${className}`}>
      {showLoginForm ? (
        <div className="bg-[#312d5a]/80 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold">Login</h3>
            <button
              onClick={() => setShowLoginForm(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <LoginForm 
            onSuccess={() => setShowLoginForm(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowLoginForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
      )}
    </div>
  );
}