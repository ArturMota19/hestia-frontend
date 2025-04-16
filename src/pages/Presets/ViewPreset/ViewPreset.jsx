// Components
import Header from "../../../basics/Header/Header";
// Images
// Imports
import { Helmet } from "react-helmet";
//Styles
import s from "./ViewPreset.module.scss";
import { useTranslation } from "react-i18next";
import ViewComponent from "../../../basics/ViewComponent/ViewComponent";

export default function ViewPreset() {
  const { t } = useTranslation();

  let fakeData = [
    {
      houseNome: 'Preset Casa 1',
      rooms: ['Cozinha', 'Sala', 'Quarto'],
    },
    {
      houseNome: 'Preset Casa 2',
      rooms: ['Cozinha', 'Sala', 'Quarto'],
    },
    {
      houseNome: 'Preset Casa 3',
      rooms: ['Cozinha', 'Sala', 'Quarto'],
    },
    {
      houseNome: 'Preset Casa 4',
      rooms: ['Cozinha', 'Sala', 'Quarto'],
    },
    {
      houseNome: 'Preset Casa 5',
      rooms: ['Cozinha', 'Sala', 'Quarto'],
    },
    {
      houseNome: 'Preset Casa 6',
      rooms: ['Cozinha', 'Sala', 'Quarto'],
    },
    {
      houseNome: 'Preset Casa 7',
      rooms: ['Cozinha', 'Sala', 'Quarto'],
    },
    {
      houseNome: 'Preset Casa 8',
      rooms: ['Cozinha', 'Sala', 'Quarto'],
    },
    {
      houseNome: 'Preset Casa 9',
      rooms: ['Cozinha', 'Sala', 'Quarto'],
    },
    {
      houseNome: 'Preset Casa 10',
      rooms: ['Cozinha', 'Sala', 'Quarto'],
    },
  ]

  return (
    <main className={s.wrapperViewPreset}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | View Preset</title>
      </Helmet>
      <Header/>
      <section className={s.hestiaInfoWrapper}>
        <h1>{t('viewHousePreset')}</h1>
        <section className={s.gridWrapper}>
          {fakeData.length > 0 ? 
            fakeData.map((item, index) => (
              <ViewComponent key={index} title={item.houseNome} text={item.rooms.join(', ')} type={'preset'} hasActions={true}/>
            ))
          :  
          <div>
            <h4>{t('noHousePreset')}</h4>
          </div>
        }
        </section>
      </section>
    </main>
  );
}