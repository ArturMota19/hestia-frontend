// Components

// Images
import houseIcon from '../../assets/icons/house-icon.svg';
// Imports
import { useTranslation } from 'react-i18next';
// Styles
import { useState, useEffect } from 'react';
import s from './Loading.module.scss';

export default function Loading() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const ptBrMessages = [
    'Validando presets...',
    'Verificando rotinas...',
    'Descansando entre as tarefas...',
    'Ajustando os parâmetros...',
    'Ligando atuadores...',
    'Ajustando sensores...',
    'Mudando temperatura...',
    'Sincronizando dispositivos...',
    'Carregando configurações...',
    'Otimizando processos...',
    'Estabelecendo conexões...',
    'Monitorando ambiente...',
    'Inicializando sistema...',
    'Atualizando dados...',
    'Preparando HESTIA para você...',
  ];
  const enMessages = [
    'Validating presets...',
    'Checking routines...',
    'Resting between tasks...',
    'Adjusting parameters...',
    'Turning on actuators...',
    'Adjusting sensors...',
    'Changing temperature...',
    'Synchronizing devices...',
    'Loading configurations...',
    'Optimizing processes...',
    'Establishing connections...',
    'Monitoring environment...',
    'Initializing system...',
    'Updating data...',
    'Preparing HESTIA for you...',
  ];

  const messages = currentLanguage === 'pt' ? ptBrMessages : enMessages;
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prevMessage) => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 800); // Change message every 800ms

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <main className={s.loading}>
      <img src={houseIcon} alt="House Icon" className={s.icon} />
      <p>{currentMessage}</p>
    </main>
  );
}