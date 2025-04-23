// Components
import Header from "../../../basics/Header/Header";
import Field from "../../../basics/Field/Field";
import DropdownField from "../../../basics/DropdownField/DropdownField"
import Button from "../../../basics/Button/Button";
// Images
// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
//Styles
import s from "./CreateRoutine.module.scss";


export default function CreateRoutine() {
  const { t, i18n } = useTranslation();

  return (
    <main className={s.wrapperCreateRoutine}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | Create Preset</title>
      </Helmet>
      <Header/>
      <section className={s.hestiaInfoWrapper}>
        <h1>{t('createRoutines')}</h1>
        <div className={s.wrapperInternForm}>
          <div>
            <h2>{t('personsRoutines')}</h2>
            {/* <Field 
              placeholder={t('search')} 
              type="text" 
              width={400} 
              height={48} 
              backgroundColor={"white"} 
              borderColor={"secondary"} 
              borderRadius={8}
            /> */}
          </div>
        </div>
        <div className={s.createButton}>
          <Button 
            text={t('addPerson')} 
            backgroundColor={"secondary"} 
            height={48}
            doFunction={() => {console.log("oi")}}
          />
        </div>
      </section>
    </main>
  );
}