import {Edhtop16Fallback} from '#src/components/fallback';
import {PropsWithChildren, Suspense} from 'react';

import './globals.css';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

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

      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-51DLXH804W"
        onLoad={() => {
          window.dataLayer = window.dataLayer || [];

          function gtag(...args: any): void;
          function gtag() {
            // eslint-disable-next-line prefer-rest-params
            window.dataLayer.push(arguments);
          }

          gtag('js', new Date());
          gtag('config', 'G-51DLXH804W');
        }}
      />

      <Suspense fallback={<Edhtop16Fallback />}>
        <main className="relative min-h-screen bg-[#514f86]">{children}</main>
      </Suspense>
    </>
  );
}
