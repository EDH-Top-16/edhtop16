import {Edhtop16Fallback} from '#src/components/fallback';
import {PropsWithChildren, Suspense, useEffect} from 'react';

import './globals.css';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/** @appRoot */
export function App({children}: PropsWithChildren<{}>) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: any): void {
      // eslint-disable-next-line prefer-rest-params -- Google Analytics requires the arguments object
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'G-51DLXH804W');
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
      />

      <meta
        name="impact-site-verification"
        // @ts-expect-error "value" is not a real property on <meta> but the vendor wants it.
        value="22b35f9f-86c1-4c02-b751-cfdff5a1c83b"
      />

      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-51DLXH804W"
      />

      <Suspense fallback={<Edhtop16Fallback />}>
        <main className="relative min-h-screen bg-[#514f86]">{children}</main>
      </Suspense>
    </>
  );
}
