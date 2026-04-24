import { useState, useEffect, useCallback } from "react";

export type Theme = "dark" | "light" | "system";
export type FontSize = "small" | "medium" | "large";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() =>
    (localStorage.getItem("nova-theme") as Theme) || "dark"
  );
  const [fontSize, setFontSizeState] = useState<FontSize>(() =>
    (localStorage.getItem("nova-font-size") as FontSize) || "medium"
  );

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    if (t === "system") {
      const sys = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", sys);
    } else {
      root.classList.toggle("dark", t === "dark");
    }
  }, []);

  const applyFontSize = useCallback((fs: FontSize) => {
    const root = document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg");
    root.style.fontSize = fs === "small" ? "14px" : fs === "large" ? "18px" : "16px";
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("nova-theme", theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    applyFontSize(fontSize);
    localStorage.setItem("nova-font-size", fontSize);
  }, [fontSize, applyFontSize]);

  const setTheme = (t: Theme) => setThemeState(t);
  const setFontSize = (fs: FontSize) => setFontSizeState(fs);

  return { theme, setTheme, fontSize, setFontSize };
}
