/**
 * Props for next-themes' inline theme script.
 *
 * The script only does its job in the server HTML, where the browser runs it
 * before first paint. React 19 warns about any <script> it renders on the
 * client, so the client render marks it `text/plain`: it would never run
 * there anyway, and the element already suppresses hydration warnings.
 *
 * Import this only from a client module (components/root-provider): a server
 * module evaluates it once, on the server, and ships that value to the client.
 */
export const themeScriptProps = {
  type: typeof window === "undefined" ? "text/javascript" : "text/plain",
};
