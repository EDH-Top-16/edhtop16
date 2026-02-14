import {Footer} from '#src/components/footer';
import {Navigation} from '#src/components/navigation';

export default function PrivacyPolicyPage() {
  return (
    <>
      <title>Privacy Policy</title>
      <meta name="description" content="Privacy Policy for EDHTop16" />
      <Navigation />

      <div className="mx-auto my-8 flex w-full max-w-(--breakpoint-md) flex-col items-center gap-6 px-8 text-white">
        <h1 className="font-title flex-1 text-5xl font-extrabold text-white">
          Privacy Policy
        </h1>

        <p className="w-full text-sm text-white/60">
          Last updated: February 14, 2026
        </p>

        <p>
          EDHTop16 (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates
          the website edhtop16.com. This Privacy Policy explains what
          information is collected, how it is used, and your choices regarding
          that information.
        </p>

        <h2 className="font-title w-full text-2xl font-bold">
          Information We Collect
        </h2>

        <p>
          EDHTop16 does not require user accounts or collect personal
          information directly. The site aggregates publicly available
          tournament data from TopDeck.gg and card data from Scryfall.
        </p>

        <h2 className="font-title w-full text-2xl font-bold">
          Cookies and Tracking
        </h2>

        <p>
          We use the following third-party services that may set cookies or
          collect usage data:
        </p>

        <ul className="w-full list-disc space-y-2 pl-6">
          <li>
            <strong>Google Analytics</strong> &ndash; We use Google Analytics to
            understand how visitors use the site (pages visited, session
            duration, etc.). Google Analytics collects anonymized usage data
            through cookies. You can opt out via the{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </li>
          <li>
            <strong>NitroPay</strong> &ndash; We use NitroPay to serve
            advertisements. NitroPay and its advertising partners may use
            cookies, web beacons, and similar technologies to collect
            information for ad personalization and measurement. For more
            information, see the{' '}
            <a
              href="https://nitropay.com/privacy"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NitroPay Privacy Policy
            </a>
            .
          </li>
        </ul>

        <h2 className="font-title w-full text-2xl font-bold">
          Your Rights and Choices
        </h2>

        <h3 className="font-title w-full text-xl font-semibold">
          GDPR (European Economic Area)
        </h3>

        <p>
          If you are located in the EEA, our consent management platform will
          prompt you to manage your data processing preferences when you first
          visit the site. You can update your preferences at any time using the
          consent management link in the footer.
        </p>

        <h3 className="font-title w-full text-xl font-semibold">
          CCPA (California)
        </h3>

        <p>
          If you are a California resident, you have the right to opt out of the
          sale of your personal information. A &quot;Do Not Sell My Personal
          Information&quot; link will appear in the footer when applicable. You
          may also contact us to exercise your rights under the California
          Consumer Privacy Act.
        </p>

        <h2 className="font-title w-full text-2xl font-bold">
          Third-Party Links
        </h2>

        <p>
          Our site contains links to external websites (TopDeck.gg, Scryfall,
          GitHub, etc.). We are not responsible for the privacy practices of
          those sites.
        </p>

        <h2 className="font-title w-full text-2xl font-bold">
          Changes to This Policy
        </h2>

        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated &quot;Last updated&quot; date.
        </p>

        <h2 className="font-title w-full text-2xl font-bold">Contact Us</h2>

        <p>
          If you have questions about this Privacy Policy, you can reach us in
          our{' '}
          <a href="https://discord.gg/UwbA42nruw" className="underline">
            Discord server
          </a>
          .
        </p>
      </div>

      <Footer />
    </>
  );
}
