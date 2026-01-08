import React from 'react';
import {GoogleAnalytics} from '@next/third-parties/google';
import {Montserrat} from 'next/font/google';

import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
});

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <main className="relative min-h-screen bg-[#514f86]">{children}</main>
      </body>

      <GoogleAnalytics gaId="G-51DLXH804W" />
    </html>
  );
}
