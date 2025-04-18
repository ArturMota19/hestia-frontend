// Images
//Styles
import s from "./Button.module.scss";

export default function Button({ type="button", text, backgroundColor, height, doFunction=false, disabled=false }) {
  return (
    <button
      style={{ height: height }}
      className={`${s.button} ${
        backgroundColor == "primary"
          ? s.primary
          : backgroundColor == "secondary"
          ? s.secondary
          : backgroundColor == "tertiary"
          ? s.tertiary
          : backgroundColor == "delete" 
          ? s.delete
          : s.quaternary
      }`
      }
      disabled={disabled}
      onClick={doFunction ? () => doFunction() : null}>
      <p>{text}</p>
    </button>
  );
}
