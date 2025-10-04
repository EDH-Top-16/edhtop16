import {createRouterApp} from '#genfiles/router/router';
import {App} from '#src/pages/_app';
import {hydrateRoot} from 'react-dom/client';

async function main() {
  const RouterApp = await createRouterApp();
  hydrateRoot(document, <RouterApp App={App} />);
}

main();
