import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noir Varna",
  description: "Digital Menu for Noir Varna",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent hydration mismatch from browser extensions
              if (typeof window !== 'undefined') {
                // Remove any attributes added by browser extensions
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'cz-shortcut-listen') {
                      mutation.target.removeAttribute('cz-shortcut-listen');
                    }
                  });
                });
                
                // Start observing when DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', () => {
                    observer.observe(document.body, { attributes: true });
                  });
                } else {
                  observer.observe(document.body, { attributes: true });
                }
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
