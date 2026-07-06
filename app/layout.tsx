import type { Metadata } from "next";
import "./globals.css";
import SiteFooter from "./components/site-footer";
import SiteNavbar from "./components/site-navbar";
import MotionSystem from "./components/motion-system";

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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:`try{var t=localStorage.getItem("nefe-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme="light"}`}}/>
      </head>
      <body className="min-h-full flex flex-col"><SiteNavbar /><MotionSystem>{children}</MotionSystem><SiteFooter /></body>
    </html>
  );
}
