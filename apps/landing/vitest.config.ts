import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    env: {
      NODE_ENV: "test",
    },
  },
  resolve: {},
});
