import {Edhtop16Fallback} from '#src/components/fallback';
import {PropsWithChildren, Suspense, useEffect} from 'react';

import './globals.css';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    nitroAds: {
      createAd: (id: string, options: Record<string, unknown>) => void;
      queue: unknown[];
    };
    __uspapi: (command: string, ...args: unknown[]) => void;
    __cmp: (command: string, ...args: unknown[]) => void;
  }
}

export default function App({children}: PropsWithChildren<{}>) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: any): void {
      // eslint-disable-next-line prefer-rest-params -- Google Analytics requires the arguments object
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'G-51DLXH804W');

    // Load NitroPay client-side only in production. Loading via JSX <script>
    // tags causes hydration mismatches because the SDK injects additional
    // scripts into <head> before React hydrates.
    const isLocal = window.location.hostname === 'localhost';
    const localAdsEnabled =
      import.meta.env.VITE_LOCAL_ADS_ENABLED ||
      new URLSearchParams(window.location.search).has('ads');
    if (!isLocal || localAdsEnabled) {
      window.nitroAds =
        window.nitroAds ||
        ({
          createAd: function () {
            return new Promise((e) => {
              window.nitroAds.queue.push(['createAd', arguments, e]);
            });
          },
          addUserToken: function () {
            window.nitroAds.queue.push(['addUserToken', arguments]);
          },
          queue: [],
        } as any);

      const nitroScript = document.createElement('script');
      nitroScript.src = 'https://s.nitropay.com/ads-2290.js';
      nitroScript.async = true;
      document.head.appendChild(nitroScript);
    }
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
