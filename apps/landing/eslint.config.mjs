import pluginRouter from "@tanstack/eslint-plugin-router";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", ".source/**", ".wrangler/**", "src/routeTree.gen.ts"] },
  { files: ["**/*.{ts,tsx}"], languageOptions: { parser: tseslint.parser } },
  ...pluginRouter.configs["flat/recommended"],
);
