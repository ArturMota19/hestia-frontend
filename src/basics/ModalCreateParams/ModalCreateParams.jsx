// Components

// Images
import closeIcon from "../../assets/icons/basicIcons/close-icon.svg";
// Imports
import Field from "../Field/Field";
import * as Yup from "yup";
import { useFormik } from "formik";
// Styles
import { useTranslation } from "react-i18next";
import s from "./ModalCreateParams.module.scss";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";


export default function ModalCreateParams({ isOpen, setIsOpen, type, formik }) {
  if (!isOpen) return null;
  const navigate = useNavigate();
  const { t } = useTranslation();

  switch (type) {
    case "person":
      const validationSchemaPeople = Yup.object().shape({
        nameParam: Yup.string().required(t('requiredField')),
        image: Yup.string().required(t('requiredField')),
      });
      const formikPeople = useFormik({
        initialValues: {
          nameParam: "",
          image: "",
        },
        validationSchema: validationSchemaPeople,
        onSubmit: async (values) => {
          console.log("values", values)
        },
      });
      return (
        <section className={s.modal}>
          <div className={s.internModal}>
            <div className={s.closeModal}>
              <button type="button" onClick={() => setIsOpen(false)}>
                <img src={closeIcon} alt="Close Modal" />
              </button>
            </div>
            <h4>{t("person")}</h4>
            <form className={s.formWrapper} onSubmit={formikPeople.handleSubmit}>
              <Field
                type="text"
                fieldName="nameParam"
                formik={formikPeople}
                isLogged={true}
              />
              {/* Do a dropwon to select one image */}
              {/* <Field
                fieldName="image"
                type="text"
                formik={formik}
                isLogged={true}
              /> */}
              <Button
                text={t("create")}
                backgroundColor={"quaternary"}
                height={32}
                type="submit"
              />
            </form>
          </div>
        </section>
      );
    case "room":      
      const validationSchemaRoom = Yup.object().shape({
        nameParam: Yup.string().required(t('requiredField')),
        capacity: Yup.number().required(t('requiredField')).positive(t('invalidCapacity')),
      });
      const formikRoom = useFormik({
        initialValues: {
          nameParam: "",
          capacity: "",
        },
        validationSchema: validationSchemaRoom,
        onSubmit: async (values) => {
          console.log(values)
        },
      });
      return (
        <section className={s.modal}>
          <div className={s.internModal}>
            <div className={s.closeModal}>
              <button type="button" onClick={() => setIsOpen(false)}>
                <img src={closeIcon} alt="Close Modal" />
              </button>
            </div>
            <h4>{t("room")}</h4>
            <form className={s.formWrapper} onSubmit={formikRoom.handleSubmit}>
              <Field
                type="text"
                fieldName="nameParam"
                formik={formikRoom}
                isLogged={true}
              />
              <Field
                type="number"
                fieldName="capacity"
                formik={formikRoom}
                isLogged={true}
              />
              <Button
                text={t("create")}
                backgroundColor={"quaternary"}
                height={32}
                type="submit"
              />
            </form>
          </div>
        </section>
      );
    case "activity":
      const validationSchemaActivity = Yup.object().shape({
        nameParam: Yup.string().required(t('requiredField')),
        errorValue: Yup.number().required(t('requiredField')).min(0, t('invalidErrorValue')).max(100, t('invalidErrorValue')),
        color: Yup.string().required(t('requiredField')),
      });
      const formikActivity = useFormik({
        initialValues: {
          nameParam: "",
          errorValue: "",
          color: ""
        },
        validationSchema: validationSchemaActivity,
        onSubmit: async (values) => {
          console.log(values)
        },
      });
      return (
        <section className={s.modal}>
          <div className={s.internModal}>
            <div className={s.closeModal}>
              <button type="button" onClick={() => setIsOpen(false)}>
                <img src={closeIcon} alt="Close Modal" />
              </button>
            </div>
            <h4>{t("activity")}</h4>
            <form className={s.formWrapper} onSubmit={formikActivity.handleSubmit}>
              <Field
                type="text"
                fieldName="nameParam"
                formik={formikActivity}
                isLogged={true}
              />
              <Field
                type="text"
                fieldName="errorValue"
                formik={formikActivity}
                isLogged={true}
              />
              <Field
                type="color"
                fieldName="color"
                formik={formikActivity}
                isLogged={true}
              />
              <Button
                text={t("create")}
                backgroundColor={"quaternary"}
                height={32}
                type="submit"
              />
            </form>
          </div>
        </section>
      );
    default:
      return (
        <section className={s.modal}>
          <div className={s.internModal}>
            <div className={s.closeModal}>
              <button onClick={() => setIsOpen(false)}>
                <img src={closeIcon} alt="Close Modal" />
              </button>
            </div>
            <h4>{t("actuator")}</h4>
            <span>{t("notPossibleActuator")}</span>
            <Button
              text={t("viewActuators")}
              backgroundColor={"quaternary"}
              height={32}
              doFunction={() => navigate("/view-params")}
            />
          </div>
        </section>
      );
  }
}
