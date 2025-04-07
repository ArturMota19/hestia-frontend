// Components
import Button from "../../../basics/Button/Button";
// Images
import houseIcon from "../../../assets/house-icon.svg"
import sunIcon from "../../../assets/sun-icon.svg"

//Styles
import s from "./Dashboard.module.scss";

export default function Dashboard() {
  return (
    <main className={s.wrapperDashboard}>
      {/* DO HERE THE DARK MODE */}
      <div className={s.sunIconWrapper}>
        <img src={sunIcon} alt={"Sun Icon"}/>
      </div>
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