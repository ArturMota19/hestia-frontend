// Images
//Styles
import { PuffLoader } from "react-spinners";
import s from "./Button.module.scss";

export default function Button({ type="button", text, backgroundColor, height, doFunction=false, disabled=false, isLoading=false }) {
  return (
    <button
      type={type}
      style={{ height: height, lineHeight: `${height/2}px` }}
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
      disabled={isLoading ? true : disabled}
      onClick={doFunction ? () => doFunction() : null}>
      {isLoading ? 
        <PuffLoader
          size={25}
          color={'var(--primary-color)'}
          speedMultiplier={1}
        />
      : <p>{text}</p>}
    </button>
  );
}
