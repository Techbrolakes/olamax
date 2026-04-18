import type { Metadata, Viewport } from "next";
import { geistMono, geistSans, instrumentSerif } from "./fonts";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileBar } from "@/components/layout/mobile-bar";
import { ConciergeFab } from "@/components/features/concierge/concierge-fab";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/constants";

const siteTitle = `${APP_NAME} — ${APP_TAGLINE}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3010"),
  title: {
    default: siteTitle,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: "Olamilekan Daramola", url: "https://github.com/Techbrolakes" }],
  creator: "Olamilekan Daramola",
  keywords: [
    "OlaMax",
    "film discovery",
    "AI movie recommendations",
    "AI film concierge",
    "movie app",
    "TMDB",
    "watchlist",
    "personalised recommendations",
    "mood-based movie search",
    "Next.js",
  ],
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: siteTitle,
    description: APP_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: APP_DESCRIPTION,
    creator: "@Techbrolakes",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f7" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>
          <AppSidebar />
          <MobileHeader />
          <main className="min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 md:pl-16">
            {children}
          </main>
          <MobileBar />
          <ConciergeFab />
        </Providers>
      </body>
    </html>
  );
}
