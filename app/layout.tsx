import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CopilotProvider } from "../components/CopilotProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Traderview",
  description: "Advanced AI-powered trading analysis dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <CopilotProvider>
          {children}
        </CopilotProvider>
      </body>
    </html>
  );
}
