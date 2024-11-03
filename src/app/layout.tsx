/**
 * Root layout komponent for applikationen
 * Definerer grundlæggende HTML struktur og metadata
 */

// Import af globale styles fra Tailwind CSS
import "@/styles/globals.css";

// Import af Geist font og Next.js metadata type
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

// Definition af side metadata
export const metadata: Metadata = {
  title: "Børnetelefonen",
  description: "Chat med en rådgiver - Børnetelefonen er her for at hjælpe dig",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

/**
 * Root layout komponent der wrapper hele applikationen med style og fonts
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
