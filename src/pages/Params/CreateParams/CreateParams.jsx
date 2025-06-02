// Components
import Header from "../../../basics/Header/Header";
import Field from "../../../basics/Field/Field";
import DropdownField from "../../../basics/DropdownField/DropdownField";
import Button from "../../../basics/Button/Button";
// Images
import peopleParam from "../../../assets/icons/params/people-param.svg";
import actuatorParam from "../../../assets/icons/params/actuator-param.svg";
import roomParam from "../../../assets/icons/params/room-param.svg";
import activityParam from "../../../assets/icons/params/activity-param.svg";
// Imports
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
//Styles
import s from "./CreateParams.module.scss";
import ModalCreateParams from "../../../basics/ModalCreateParams/ModalCreateParams";
import AddActivityModal from "../../../basics/RoutineModal/AddActivityModal";

export default function CreateParams() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [type, setType] = useState("");

  function handleOpenModal(type) {
    setIsModalOpen(true);
    setType(type);
  }
  
  const ItemParam = ({ noCreate = false, img, text, type }) => {
    return (
      <div className={s.itemParam}>
        <h3>{text}</h3>
        <img src={img} alt={text} />
        <Button
          text={!noCreate ? t("create") : t("view")}
          backgroundColor={"secondary"}
          height={48}
          doFunction={() => handleOpenModal(type)}
        />
      </div>
    );
  };

  return (
    <main className={s.wrapperCreateParams}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | Create Params</title>
      </Helmet>
      <Header />
      <ModalCreateParams isOpen={isModalOpen} setIsOpen={setIsModalOpen} type={type}/>
      <AddActivityModal
        isActivityModalOpen={isActivityModalOpen}
        setIsActivityModalOpen={setIsActivityModalOpen}
      />
      <section className={s.hestiaInfoWrapper}>
        <h1>{t("createParams")}</h1>
        <div className={s.wrapperInternForm}>
          <ItemParam img={peopleParam} text={t("person")} type={"person"} />
          <ItemParam img={actuatorParam} text={t("actuator")} type={"actuator"}  noCreate={true} />
          <ItemParam img={roomParam} text={t("room")} type={"room"}/>
          <ItemParam img={activityParam} text={t("activity")} type={"activity"}/>
          <div className={s.itemParam}>
            <h3>{t("activityToPreset")}</h3>
            <img src={activityParam} alt={t("activityToPreset")} />
            <Button
              text={t("create")}
              backgroundColor={"secondary"}
              height={48}
              doFunction={() => setIsActivityModalOpen(true)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
