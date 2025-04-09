// Components

// Images
import sunIcon from "../../assets/sun-icon.svg";
import moonIcon from "../../assets/moon-icon.svg";
// Imports
import { useEffect, useState } from "react";
// Styles
import s from "./ToggleTheme.module.scss";

export default function ThemeToggleButton() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Recuperar tema salvo
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={s.themeIconWrapper}>
      {theme === "light" ? 
        <img
          src={sunIcon}
          alt="Light Mode"
          className={s.themeIcon}
          onClick={toggleTheme}
        />
        :
        <img
          src={moonIcon}
          alt="Dark Mode"
          className={s.themeIcon}
          onClick={toggleTheme}
        />
      }
    </div>

  );
}