import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/components/progress-provider";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { InstallPrompt } from "@/components/install-prompt";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AfriLingo — Apprends les langues africaines",
  description:
    "Apprends le N'Ko et d'autres langues africaines : micro-leçons interactives, hors-ligne, gamifiées.",
  applicationName: "AfriLingo",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "AfriLingo",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "AfriLingo — Apprends les langues africaines",
    description:
      "Apprends le N'Ko et d'autres langues africaines : micro-leçons interactives, hors-ligne.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-ink font-sans text-cream antialiased">
        <ProgressProvider>
          <div className="relative z-10">{children}</div>
          <ServiceWorkerRegister />
          <InstallPrompt />
        </ProgressProvider>
      </body>
    </html>
  );
}