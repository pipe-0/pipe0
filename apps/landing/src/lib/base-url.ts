export function getBaseUrl() {
  return process.env.NODE_ENV === "production"
    ? "https://pipe0.com"
    : "http://localhost:3000";
}
