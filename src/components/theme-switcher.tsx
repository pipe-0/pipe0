"use client";

import { useEffect } from "react";

export function ThemeSwitcher() {
  useEffect(() => {
    const htmlEl = document.querySelector("html");
    if (htmlEl && htmlEl.classList.contains("dark")) {
      htmlEl.classList.remove("dark");
    }
  }, []);

  return null;
}
