// Components
import Button from "../../../basics/Button/Button";
import ThemeToggleButton from "../../../basics/ToggleTheme/ToggleTheme";
import LanguageToggleButton from "../../../basics/LanguageToggleButton/LanguageToggleButton";
// Images
import houseIcon from "../../../assets/icons/house-icon.svg";

// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
//Styles
import s from "./Dashboard.module.scss";


export default function Dashboard() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation();
  return (
    <main className={s.wrapperDashboard}>
      <ThemeToggleButton isHeader={false}/>
      <div className={"languageToggleButtonWrapper"}>
        <LanguageToggleButton/>
      </div>
      <Helmet>
          <meta charSet="utf-8" />
          <title>HESTIA | Dashboard</title>
      </Helmet>
      <section className={s.hestiaInfoWrapper}>
        <div className={s.titleWrapper}>
          <h1>HESTIA</h1>
          <p>Home Environment Simulator Targeting Inhabitant Activities</p>
        </div>
        <div className={s.buttonWrapper}>
          <Button 
            text={t('register')} 
            backgroundColor={""} 
            height={64}
            doFunction={() => navigate("/register")}/>
            <Button 
            text={t('login')} 
            backgroundColor={"tertiary"} 
            height={64}
            doFunction={() => navigate("/login")}/>
        </div>
      </section>
      <div className={s.houseIconWrapper} >
        <img src={houseIcon} alt="House Icon"/>
      </div>
    </main>
  );
}