import { Geist_Mono } from "next/font/google";

/**
 * Preloaded copy of the mono the root layout declares without preloading.
 *
 * next/font preloads a font on every route whose layout imports it, so the
 * root layout only preloads Schibsted (what every marketing page paints
 * first). Layouts that paint code above the fold apply this class name to
 * their own wrapper: the custom property is redefined there and the same file
 * is preloaded, on those routes only. One font per module, so importing one
 * doesn't preload the other.
 */
export const monoPreloaded = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
