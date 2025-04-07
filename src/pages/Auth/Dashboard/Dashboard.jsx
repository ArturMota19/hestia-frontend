
// Images
import houseIcon from "../../../assets/house-icon.svg"
//Styles
import s from "./Dashboard.module.scss";

export default function Dashboard() {
  return (
    <main className={s.wrapperDashboard}>
      <section>
        <div className={s.titleWrapper}>
          <h1>HESTIA</h1>
          <p>Home Environment Simulator Targeting Inhabitant Activities</p>
        </div>
      </section>
      <div className={s.houseIconWrapper} >
        <img src={houseIcon} alt="House Icon"/>
      </div>
    </main>
  );
}