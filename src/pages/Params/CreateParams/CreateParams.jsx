// Components
import Header from "../../../basics/Header/Header";
import Field from "../../../basics/Field/Field";
import DropdownField from "../../../basics/DropdownField/DropdownField"
import Button from "../../../basics/Button/Button";
// Images
import peopleParam from "../../../assets/icons/params/people-param.svg";
import actuatorParam from "../../../assets/icons/params/actuator-param.svg";
import roomParam from "../../../assets/icons/params/room-param.svg";
import activityParam from "../../../assets/icons/params/activity-param.svg";
// Imports
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
//Styles
import s from "./CreateParams.module.scss";


export default function CreateParams() {
  const {t} = useTranslation();

  const ItemParam = ({noCreate=false, img, text}) => {
    return (
      <div className={s.itemParam}>
        <h3>{text}</h3>
        <img src={img} alt={text} />
        <Button
          text={!noCreate ? t('create') : t('view')} 
          backgroundColor={"secondary"} 
          height={48}
          doFunction={console.log("edit")}
        />
      </div>
    )
  }

  return (
    <main className={s.wrapperCreateParams}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | Create Params</title>
      </Helmet>
      <Header/>
      <section className={s.hestiaInfoWrapper}>
        <h1>{t('createParams')}</h1>
        <div className={s.wrapperInternForm}>
          <ItemParam
            img={peopleParam}
            text={t('people')}
          />
          <ItemParam
            img={actuatorParam}
            text={t('actuator')}
            noCreate={true}
          />
          <ItemParam
            img={roomParam}
            text={t('room')}
          />
          <ItemParam
            img={activityParam}
            text={t('activity')}
          />
        </div>
      </section>
    </main>
  );
}