import type { Metadata } from "next";
import { ensureSeed } from "@/lib/db";
import "./globals.css";

// Create the demo creator on first load. No-op once data exists.
ensureSeed();

export const metadata: Metadata = {
  title: {
    default: "Gatekeeper — Gate any link behind a social action",
    template: "%s · Gatekeeper",
  },
  description:
    "Put a step in front of anything you share. Visitors subscribe, follow, join or sign up, and your content opens. Grow followers, subscribers and email lists from every link.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
