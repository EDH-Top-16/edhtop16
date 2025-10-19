import {Edhtop16Fallback} from '#src/components/fallback';
import {PropsWithChildren, Suspense} from 'react';

import '../globals.css';

/** @appRoot */
export function App({children}: PropsWithChildren<{}>) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
      />
      <Suspense fallback={<Edhtop16Fallback />}>
        <main className="relative min-h-screen bg-[#514f86]">{children}</main>
      </Suspense>
    </>
  );
}
