import {createRiverApp} from '#genfiles/river/router';
import {createHead, UnheadProvider} from '@unhead/react/client';
import {StrictMode, Suspense} from 'react';
import {hydrateRoot, createRoot} from 'react-dom/client';
import {RelayEnvironmentProvider} from 'react-relay/hooks';
import {getClientEnvironment} from './lib/client/relay_client_environment';
import {App} from './pages/_app';
import {getCurrentPreferences} from './lib/shared/cookie-utils';
import {LoadingShell} from './components/loading_shell';

async function main() {
  const head = createHead();
  const env = getClientEnvironment()!;
  const rootElement = document.getElementById('root')!;

  const shouldWaitForPreferences = (window as any)
    .__SHOULD_WAIT_FOR_PREFERENCES__;

  if (shouldWaitForPreferences) {
    const currentPrefs = getCurrentPreferences();

    const RiverApp = await createRiverApp({getEnvironment: () => env});

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
      </StrictMode>,
    );

    delete (window as any).__SHOULD_WAIT_FOR_PREFERENCES__;
  } else {
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
