// entry-client.tsx - Updated with conditional loading
import {createRiverApp} from '#genfiles/river/router';
import {createHead, UnheadProvider} from '@unhead/react/client';
import {StrictMode, Suspense} from 'react';
import {hydrateRoot, createRoot} from 'react-dom/client';
import {RelayEnvironmentProvider} from 'react-relay/hooks';
import {getClientEnvironment} from './lib/client/relay_client_environment';
import {App} from './pages/_app';
// NEW IMPORTS:
import {getCurrentPreferences} from './lib/shared/cookie-utils'; // You'll create this
import {LoadingShell} from './components/loading_shell'; // You'll create this

async function main() {
  const head = createHead();
  const env = getClientEnvironment()!;
  const rootElement = document.getElementById('root')!;

  // NEW: Check if server rendered with data or just a shell
  const shouldWaitForPreferences = (window as any).__SHOULD_WAIT_FOR_PREFERENCES__;

  if (shouldWaitForPreferences) {
    // Server rendered a loading shell, now we need to render with actual data
    console.log('Client: Server rendered loading shell, now rendering with preferences');
    
    // Get current preferences from cookies
    const currentPrefs = getCurrentPreferences();
    console.log('Client preferences:', currentPrefs);

    // Create the app with current preferences
    const RiverApp = await createRiverApp({getEnvironment: () => env});

    // Replace the loading shell with the real app using createRoot
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <UnheadProvider head={head}>
          <RelayEnvironmentProvider environment={env}>
            <App>
              <Suspense fallback={<LoadingShell />}>
                <RiverApp />
              </Suspense>
            </App>
          </RelayEnvironmentProvider>
        </UnheadProvider>
      </StrictMode>
    );

    // Clean up the loading flag
    delete (window as any).__SHOULD_WAIT_FOR_PREFERENCES__;
    
  } else {
    // Server rendered with data, hydrate normally (your existing behavior)
    console.log('Client: Server rendered with data, hydrating normally');
    
    const RiverApp = await createRiverApp({getEnvironment: () => env});

    hydrateRoot(
      rootElement,
      <StrictMode>
        <UnheadProvider head={head}>
          <RelayEnvironmentProvider environment={env}>
            <App>
              <RiverApp />
            </App>
          </RelayEnvironmentProvider>
        </UnheadProvider>
      </StrictMode>,
    );
  }
}

main().catch(console.error);