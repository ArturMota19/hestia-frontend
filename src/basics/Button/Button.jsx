
// Images
//Styles
import s from "./Button.module.scss";

export default function Button({text, backgroundColor, height}) {
  console.log(backgroundColor);
  return (
    <button 
      style={{height: height}} 
      className={`${s.button} ${backgroundColor == "primary" ? s.primary : backgroundColor == "secondary" ? s.secondary : backgroundColor == "tertiary" ? s.tertiary : s.quaternary}`}
      >
      <p>{text}</p>
    </button>
  );
}