import {createRouterApp} from '#genfiles/router/router';
import {StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {RelayEnvironmentProvider} from 'react-relay/hooks';
import {getClientEnvironment} from './lib/client/relay_client_environment';
import {App} from './pages/_app';

async function main() {
  const env = getClientEnvironment()!;
  const RouterApp = await createRouterApp({getEnvironment: () => env});

  hydrateRoot(
    document,
    <StrictMode>
      <RelayEnvironmentProvider environment={env}>
        <RouterApp.Shell>
          <App>
            <RouterApp />
          </App>
        </RouterApp.Shell>
      </RelayEnvironmentProvider>
    </StrictMode>,
  );
}

main();
