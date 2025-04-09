// Components
import Button from "../../../basics/Button/Button";
// Images
import houseIcon from "../../../assets/house-icon.svg"
import sunIcon from "../../../assets/sun-icon.svg"

// Imports
import { Helmet } from "react-helmet";
//Styles
import s from "./Dashboard.module.scss";
import ThemeToggleButton from "../../../basics/ToggleTheme/ToggleTheme";

export default function Dashboard() {
  return (
    <main className={s.wrapperDashboard}>
      <ThemeToggleButton/>
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
            text={"Registrar-se"} 
            backgroundColor={""} 
            height={64}/>
            <Button 
            text={"Logar-se"} 
            backgroundColor={"tertiary"} 
            height={64}/>
        </div>
      </section>
      <div className={s.houseIconWrapper} >
        <img src={houseIcon} alt="House Icon"/>
      </div>
    </main>
  );
}