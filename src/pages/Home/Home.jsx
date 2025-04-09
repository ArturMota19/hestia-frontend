// Components
import Button from "../../basics/Button/Button";
import ThemeToggleButton from "../../basics/ToggleTheme/ToggleTheme";
// Images
import houseIcon from "../../assets/house-icon.svg";

// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
//Styles
import s from "./Home.module.scss";

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className={s.wrapperHome}>
      <ThemeToggleButton/>
      <Helmet>
          <meta charSet="utf-8" />
          <title>HESTIA | Home</title>
      </Helmet>
      <section className={s.hestiaInfoWrapper}>
        
        
      </section>
      <div className={s.houseIconWrapper} >
        <img src={houseIcon} alt="House Icon"/>
      </div>
    </main>
  );
}