// Components

// Images
import sunIcon from "../../assets/icons/sun-icon.svg";
import moonIcon from "../../assets/icons/moon-icon.svg";
import sunIconHeader from "../../assets/icons/header/sun-icon-header.svg";
import moonIconHeader from "../../assets/icons/header/moon-icon-header.svg";
// Imports
import { useEffect, useState } from "react";
// Styles
import s from "./ToggleTheme.module.scss";

export default function ThemeToggleButton(isHeader=false) {
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

  if(isHeader){
    return(
      <>
        {theme === "light" ? 
          <img
            src={sunIconHeader}
            alt="Light Mode"
            className={s.themeIcon}
            onClick={toggleTheme}
          />
          :
          <img
            src={moonIconHeader}
            alt="Dark Mode"
            className={s.themeIcon}
            onClick={toggleTheme}
          />
        }
      </>
    )
  }

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