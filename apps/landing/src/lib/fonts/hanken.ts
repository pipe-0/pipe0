import { Hanken_Grotesk } from "next/font/google";

/**
 * Preloaded copy of the blog sans (blog posts, author pages, reviews), which
 * the root layout declares without preloading. See ./mono.ts.
 */
export const hankenPreloaded = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
