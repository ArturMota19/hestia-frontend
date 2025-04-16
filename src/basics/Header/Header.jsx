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
      <div className={s.internHeader}>
        <LanguageToggleButton/>
        <a href='/home'>HESTIA</a>
        <ThemeToggleButton isHeader={true}/>
      </div>
    </header>
  );
}