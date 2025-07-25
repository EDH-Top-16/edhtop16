import {createRiverApp} from '#genfiles/river/router';
import {createHead, UnheadProvider} from '@unhead/react/client';
import {StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {RelayEnvironmentProvider} from 'react-relay/hooks';
import {getClientEnvironment} from './lib/client/relay_client_environment';
import {App} from './pages/_app';

async function main() {
  const head = createHead();
  const env = getClientEnvironment()!;
  const RiverApp = await createRiverApp({getEnvironment: () => env});

  hydrateRoot(
    document.getElementById('root')!,
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

main();
