import {Link} from '#genfiles/router/router';
import {useEffect, useRef} from 'react';

export function Footer() {
  const privacyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = privacyRef.current;
    if (!container) return;

    // Create CCPA and GDPR elements client-side only to avoid hydration
    // mismatches (NitroPay injects child elements into these before React
    // can hydrate).
    if (!container.querySelector('[data-ccpa-link]')) {
      const ccpa = document.createElement('span');
      ccpa.setAttribute('data-ccpa-link', '');
      ccpa.className = 'text-sm text-white/60';
      container.appendChild(ccpa);
    }

    if (!container.querySelector('#ncmp-consent-link')) {
      const gdpr = document.createElement('div');
      gdpr.id = 'ncmp-consent-link';
      gdpr.className = 'text-sm text-white/60';
      container.appendChild(gdpr);
    }

    // Instruct NitroPay to populate the links (needed after SPA navigations).
    if (typeof window.__uspapi === 'function') {
      window.__uspapi('addLink');
    }
    if (typeof window.__cmp === 'function') {
      window.__cmp('addConsentLink');
    }
  });

  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-md) flex-wrap justify-center gap-x-6 gap-y-2 p-6 pb-8">
      <Link
        href="/about"
        className="text-sm text-white/60 underline decoration-transparent transition-colors hover:text-white hover:decoration-inherit"
      >
        About
      </Link>

      <Link
        href="/privacy"
        className="text-sm text-white/60 underline decoration-transparent transition-colors hover:text-white hover:decoration-inherit"
      >
        Privacy Policy
      </Link>

      <a
        href="https://github.com/EDH-Top-16/edhtop16"
        target="_blank"
        rel="noopener"
        className="text-sm text-white/60 underline decoration-transparent transition-colors hover:text-white hover:decoration-inherit"
      >
        GitHub
      </a>

      <a
        href="https://topdeck.gg"
        target="_blank"
        rel="noopener"
        className="text-sm text-white/60 underline decoration-transparent transition-colors hover:text-white hover:decoration-inherit"
      >
        TopDeck.gg
      </a>

      {/* Container for NitroPay privacy links, populated client-side only. */}
      <div ref={privacyRef} className="contents" />
    </div>
  );
}
