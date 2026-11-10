import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("pexly-theme") as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = document.documentElement;
    const other: Theme = theme === "dark" ? "light" : "dark";

    // main.tsx initializes the stored theme before React renders. Only touch
    // the DOM if the class genuinely needs to change, avoiding unnecessary
    // full-document style recalculations on initial page load.
    if (!root.classList.contains(theme) || root.classList.contains(other)) {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }

    localStorage.setItem("pexly-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
