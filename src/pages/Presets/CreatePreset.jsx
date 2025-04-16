// Components
import Header from "../../basics/Header/Header";
// Images
// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
//Styles
import s from "./CreatePreset.module.scss";


export default function CreatePreset() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <main className={s.wrapperCreatePreset}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | Create Preset</title>
      </Helmet>
      <Header/>
      <section className={s.hestiaInfoWrapper}>
      </section>
    </main>
  );
}