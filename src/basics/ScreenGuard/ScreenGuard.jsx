import React, { useEffect, useState } from "react";
import s from "./ScreenGuard.module.scss";

const ScreenGuard = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(window.innerWidth >= 1150);

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
          <h1>O acesso a este site não está disponível para aparelhos móveis.</h1>
          <p>Por favor, use um dispositivo com uma tela maior.</p>
        </div>
      </main>
    );
  }

  return children;
};

export default ScreenGuard;
