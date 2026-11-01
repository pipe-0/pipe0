export function getBaseUrl() {
  return import.meta.env.PROD
    ? "https://pipe0.com"
    : "http://localhost:3000";
}
