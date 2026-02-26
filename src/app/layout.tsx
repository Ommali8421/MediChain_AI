import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "MediChain AI — Decentralized Medical Platform",
  description: "Secure, AI-powered, decentralized medical records platform. Your health data, fully encrypted, always yours.",
  keywords: ["medical", "blockchain", "AI", "healthcare", "decentralized", "HIPAA"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
