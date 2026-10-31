import hanken from "@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2?url";
import mono from "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url";
import schibsted from "@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2?url";

const preloadFont = (href: string) => ({
  rel: "preload",
  as: "font",
  type: "font/woff2",
  href,
  crossOrigin: "anonymous" as const,
});

// Each preload competes for the first paint, so a route preloads only what it
// paints above the fold.
export const preloadSchibsted = preloadFont(schibsted);
export const preloadMono = preloadFont(mono);
export const preloadHanken = preloadFont(hanken);
