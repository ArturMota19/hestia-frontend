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
    'Limpando piscina...',
    'Arrumando jardim...',
    'Podando as árvores...',
    'Passando protetor solar...',
    'Organizando as espreguiçadeiras...',
    'Preparando o quiosque...',
    'Verificando os guarda-sóis...',
    'Recolhendo conchas na areia...',
    'Cuidando do paisagismo...',
    'Ajustando as redes de vôlei...',
    'Servindo água de coco gelada...',
    'Varrendo o deck da piscina...'
  ];
  const enMessages = [
    'Cleaning the pool...',
    'Tidying up the garden...',
    'Trimming the trees...',
    'Applying sunscreen...',
    'Arranging the loungers...',
    'Preparing the kiosk...',
    'Checking the umbrellas...',
    'Collecting shells on the sand...',
    'Taking care of the landscaping...',
    'Adjusting the volleyball nets...',
    'Serving cold coconut water...',
    'Sweeping the pool deck...'
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