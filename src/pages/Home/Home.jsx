// Components
import Button from "../../basics/Button/Button";
import ThemeToggleButton from "../../basics/ToggleTheme/ToggleTheme";
// Images
import houseIcon from "../../assets/icons/house-icon.svg";
import createParamsIcon from "../../assets/icons/dashboard/create-params.svg";
import createPresetsIcon from "../../assets/icons/dashboard/create-presets.svg";
import createRoutinesIcon from "../../assets/icons/dashboard/create-routines.svg";
import seeParamsIcon from "../../assets/icons/dashboard/see-params.svg";
import seePresetsIcon from "../../assets/icons/dashboard/see-presets.svg";
import seeRoutinesIcon from "../../assets/icons/dashboard/see-routines.svg";
// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
//Styles
import s from "./Home.module.scss";

export default function Home() {
  const navigate = useNavigate()

  const ItemGrid = ({icon, url, text}) => {
    return (
      <a href={url ?? "/"} className={s.item}>
        <img src={icon}/>
        <p>{text}</p>
      </a>
    )
  }

  return (
    <main className={s.wrapperHome}>
      <ThemeToggleButton/>
      <Helmet>
          <meta charSet="utf-8" />
          <title>HESTIA | Home</title>
      </Helmet>
      <section className={s.hestiaInfoWrapper}>
        <h1>HESTIA</h1>
        <div className={s.gridItems}>
          <ItemGrid icon={createParamsIcon} url="/create-params" text="Criar Parâmetros" />
          <ItemGrid icon={seeParamsIcon} url="/see-params" text="Visualizar Parâmetros" />
          <ItemGrid icon={createPresetsIcon} url="/create-presets" text="Criar Presets" />
          <ItemGrid icon={seePresetsIcon} url="/see-presets" text="Visualizar Presets" />
          <ItemGrid icon={createRoutinesIcon} url="/create-routines" text="Criar Rotinas" />
          <ItemGrid icon={seeRoutinesIcon} url="/see-routines" text="Visualizar Rotinas" />
        </div>
      </section>
      <div className={s.houseIconWrapper} >
        <img src={houseIcon} alt="House Icon"/>
      </div>
    </main>
  );
}