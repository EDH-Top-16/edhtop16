import {useHead} from '@unhead/react';
import {PropsWithChildren, useEffect, useRef} from 'react';
import { useSession } from '../lib/client/use_session';

function SessionInitializer() {
  const { sessionData } = useSession();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only log once to avoid multiple initializations
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      console.log('App session initialized:', {
        isAuthenticated: sessionData.isAuthenticated,
        userId: sessionData.userId,
        hasPreferences: Object.keys(sessionData.preferences).length > 0
      });
    }
  }, [sessionData]);

  return null; // This component doesn't render anything
}

export function App({children}: PropsWithChildren<{}>) {
  useHead({
    link: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: '',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
      },
    ],
  });

  return (
    <main className="relative min-h-screen bg-[#514f86]">
      <SessionInitializer />
      {children}
    </main>
  );
}
