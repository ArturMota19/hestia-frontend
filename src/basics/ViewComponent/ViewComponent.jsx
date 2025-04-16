// Components
// Images
import houseIcon from "../../assets/icons/house-icon.svg";
// Imports
//Styles
import s from "./ViewComponent.module.scss";

export default function ViewComponent({title, text, type, hasActions=false}) {
  return (
    <div className={s.wrapperViewComponent}>
      <div>
        <h5>{title}</h5>
        <p>{text}</p>
      </div>
      <img src={type == 'preset' ? houseIcon : '/'}/>
    </div>
  );
}