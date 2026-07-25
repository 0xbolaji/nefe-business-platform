import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/docs";

const publicRoutes = [
  "",
  "/about",
  "/businesses",
  "/commerce-graph",
  "/commercial-ecosystems",
  "/consumers",
  "/contact",
  "/developers",
  "/merchants",
  "/onboarding",
  "/opportunity-engine",
  "/platform",
  "/solutions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = [...publicRoutes, "/docs", ...getAllDocs().map((doc) => doc.route)];

  return [...new Set(routes)].map((route) => ({
    url: new URL(route || "/", baseUrl).toString(),
    changeFrequency: route.startsWith("/docs") ? "monthly" : "weekly",
    priority: route === "" ? 1 : route === "/docs" || route === "/platform" ? 0.9 : 0.7,
  }));
}
