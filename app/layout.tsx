import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEFE — Grow Through Strategic Partnerships",
  description:
    "Connect with trusted businesses, launch joint campaigns, exchange referrals, and unlock new revenue opportunities.",
  icons: {
    icon: "/nefe-logo-purple.png",
    apple: "/nefe-logo-purple.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
