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
import s from "./CreatePreset.module.scss";
import Loading from "../../basics/Loading/Loading";
import Header from "../../basics/Header/Header";

export default function CreatePreset() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <main className={s.wrapperCreatePreset}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | Create Preset</title>
      </Helmet>
      <Header/>
      <section className={s.hestiaInfoWrapper}>
      </section>
    </main>
  );
}