"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = t === "dark" || (t === "system" && systemDark);

    root.classList.toggle("dark", isDark);
    setResolvedTheme(isDark ? "dark" : "light");
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
  };

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) ?? "system";
    setThemeState(saved);
    applyTheme(saved);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (saved === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
