// Components
import Button from "../../basics/Button/Button";
import ThemeToggleButton from "../../basics/ToggleTheme/ToggleTheme";
// Images
import houseIcon from "../../assets/icons/house-icon.svg";
import createParamsIcon from "../../assets/icons/dashboard/create-params.svg";
import createPresetsIcon from "../../assets/icons/dashboard/create-presets.svg";
import createRoutinesIcon from "../../assets/icons/dashboard/create-routines.svg";
import viewParamsIcon from "../../assets/icons/dashboard/see-params.svg";
import viewPresetsIcon from "../../assets/icons/dashboard/see-presets.svg";
import viewRoutinesIcon from "../../assets/icons/dashboard/see-routines.svg";
// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
//Styles
import s from "./Home.module.scss";
import LanguageToggleButton from "../../basics/LanguageToggleButton/LanguageToggleButton";

export default function Home() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const ItemGrid = ({ icon, url, text }) => {
    return (
      <a href={url ?? "/"} className={s.item}>
        <img src={icon} />
        <p>{text}</p>
      </a>
    );
  };

  return (
    <main className={s.wrapperHome}>
      <ThemeToggleButton />
      <div className={"languageToggleButtonWrapper"}>
        <LanguageToggleButton />
      </div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | Home</title>
      </Helmet>
      <section className={s.hestiaInfoWrapper}>
        <h1>HESTIA</h1>
        <div className={s.gridItems}>
          <ItemGrid
            icon={createParamsIcon}
            url="/create-params"
            text={t("createParams")}
          />
          <ItemGrid
            icon={viewParamsIcon}
            url="/see-params"
            text={t("viewParams")}
          />
          <ItemGrid
            icon={createPresetsIcon}
            url="/create-presets"
            text={t("createPresets")}
          />
          <ItemGrid
            icon={viewPresetsIcon}
            url="/see-presets"
            text={t("viewPresets")}
          />
          <ItemGrid
            icon={createRoutinesIcon}
            url="/create-routines"
            text={t("createRoutines")}
          />
          <ItemGrid
            icon={viewRoutinesIcon}
            url="/see-routines"
            text={t("viewRoutines")}
          />
        </div>
      </section>
      <div className={s.houseIconWrapper}>
        <img src={houseIcon} alt="House Icon" />
      </div>
    </main>
  );
}