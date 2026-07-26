import type { Metadata } from "next";
import "./globals.css";
import "./product-marketing.css";
import SiteFooter from "./components/site-footer";
import SiteNavbar from "./components/site-navbar";
import MotionSystem from "./components/motion-system";
import { SiteChrome } from "./components/site-chrome";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "NEFE — Business Network",
  description:
    "A business-first commercial platform for connected commerce, shared customer value, and measurable growth.",
  icons: {
    icon: "/nefe-logo-purple.png",
    apple: "/nefe-logo-purple.png",
  },
  openGraph: {
    title: "NEFE Business Network",
    description: "The operating layer for connected commerce.",
    type: "website",
    images: [{ url: "/og-product.png", width: 1731, height: 909, alt: "NEFE Business Network — The operating layer for connected commerce." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEFE Business Network",
    description: "The operating layer for connected commerce.",
    images: ["/og-product.png"],
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
      <body className="min-h-full flex flex-col"><SiteChrome><SiteNavbar /></SiteChrome><MotionSystem>{children}</MotionSystem><SiteChrome><SiteFooter /></SiteChrome></body>
    </html>
  );
}
