import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * @typedef {import('@typescript-eslint/utils').TSESLint.FlatConfig} FlatConfig
 */

/**
 * @type {Array<FlatConfig>}
 */
const eslintConfig = [
  {
    files: "apps/landing/**/*",
    extends: [...compat.extends("next/core-web-vitals", "next/typescript")],
  },
];

export default eslintConfig;
