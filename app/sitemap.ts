import type { MetadataRoute } from "next";

const BASE = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/how-it-works",
    "/pricing",
    "/create",
    "/features/social-unlock",
    "/features/email-gate",
    "/features/link-in-bio",
    "/features/release-links",
    "/features/short-links",
    "/features/analytics",
    "/for/youtubers",
    "/for/streamers",
    "/for/music-producers",
    "/for/game-creators",
    "/for/teams",
    "/guides",
    "/blog",
    "/terms",
    "/privacy",
    "/cookies",
    "/contact",
  ];
  return routes.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.6,
  }));
}
