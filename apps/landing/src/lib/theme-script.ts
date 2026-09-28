/**
 * Props for next-themes' inline theme script.
 *
 * The script only does its job in the server HTML, where the browser runs it
 * before first paint. React 19 warns about any <script> it renders on the
 * client, so the client render marks it `text/plain`: it would never run
 * there anyway, and the element already suppresses hydration warnings.
 */
export const themeScriptProps = {
  type: typeof window === "undefined" ? "text/javascript" : "text/plain",
};
