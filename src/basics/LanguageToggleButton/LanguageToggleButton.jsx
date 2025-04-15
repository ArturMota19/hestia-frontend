// Components

// Images
import brazilFlag from '../../assets/icons/language/brazil-flag.svg';
import usFlag from '../../assets/icons/language/us-flag.svg';
// Imports
import { useTranslation } from 'react-i18next';
// Styles
import s from './LanguageToggleButton.module.scss';

export default function LanguageToggleButton() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  return (
    <button onClick={toggleLanguage} className={s.languageToggleButton}>
      {i18n.language === 'pt' ? <img src={brazilFlag} alt='pt-br'/> : <img src={usFlag} alt='en-us'/>}
    </button>
  );
}
