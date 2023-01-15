import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { Theme, ThemeContext, UserContext } from "../lib/context";
import { Toaster } from "react-hot-toast";
import { useUserData } from "../lib/hooks";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const userData = useUserData();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) // using the Window.matchMeida() api to check the OS theme
    ) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={userData}>
        {/* sets className="dark" for tailwind to enable dark mode css */}
        <div className={theme}>
          <Navbar />
          <Component {...pageProps} />
          <Toaster />
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default MyApp;
