// Components
import LanguageToggleButton from '../LanguageToggleButton/LanguageToggleButton'
import ThemeToggleButton from '../ToggleTheme/ToggleTheme';
// Images

// Imports

// Styles
import s from './Header.module.scss'

export default function Header() {
  return (
    <header className={s.headerWrapper}>
      <LanguageToggleButton/>
      <h4>HESTIA</h4>
      <ThemeToggleButton isHeader={true}/>
    </header>
  );
}