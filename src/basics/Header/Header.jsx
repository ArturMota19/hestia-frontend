// Components
import LanguageToggleButton from '../LanguageToggleButton/LanguageToggleButton'
import ThemeToggleButton from '../ToggleTheme/ToggleTheme';
// Images
import { IoMdArrowRoundBack } from "react-icons/io";
// Imports
import { useNavigate } from 'react-router-dom';

// Styles
import s from './Header.module.scss'

export default function Header() {
  const navigate = useNavigate()
  return (
    <header className={s.headerWrapper}>
      <div className={s.internHeader}>
        <div className={s.wrapperBackLanguage}>
          <button onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack size={40} color='#FFF'/>
          </button>
          <LanguageToggleButton/>
        </div>
        <a href='/home'>HESTIA</a>
        <ThemeToggleButton isHeader={true}/>
      </div>
    </header>
  );
}