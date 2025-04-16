import React, { useEffect, useState } from "react";
import s from "./ScreenGuard.module.scss";
import LanguageToggleButton from "../LanguageToggleButton/LanguageToggleButton";
import { useTranslation } from "react-i18next";

const ScreenGuard = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(window.innerWidth >= 1150);

  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setIsAllowed(window.innerWidth >= 1150);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isAllowed) {
    return (
      <main className={s.screenGuardWrapper}>
        <div className={s.screenGuardContent}>
          <LanguageToggleButton/>
          <h1>{t('mobileOnly')}</h1>
          <p>{t('mobileOnlyDesc')}</p>
        </div>
      </main>
    );
  }

  return children;
};

export default ScreenGuard;
