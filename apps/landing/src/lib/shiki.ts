import type { RemarkAutoTypeTableOptions } from "fumadocs-typescript";
import { pipe0CodeTheme } from "@/lib/shiki-theme";

export const shikiConfig: RemarkAutoTypeTableOptions["shiki"] = {
  themes: {
    light: pipe0CodeTheme,
    dark: pipe0CodeTheme,
  },
};
