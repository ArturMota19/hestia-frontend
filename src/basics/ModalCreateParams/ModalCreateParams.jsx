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
import { BaseRequest } from "../../services/BaseRequest";
import { useState } from "react";
import toast from "react-hot-toast";


export default function ModalCreateParams({ isOpen, setIsOpen, type, formik }) {
  if (!isOpen) return null;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false)

  switch (type) {
    case "person":
      const validationSchemaPeople = Yup.object().shape({
        nameParam: Yup.string().required(t('requiredField')),
      });
      const formikPeople = useFormik({
        initialValues: {
          nameParam: "",
        },
        validationSchema: validationSchemaPeople,
        onSubmit: async (values) => {
          const response = await BaseRequest({
            method: "POST",
            url: "/people/register",
            data: {name: values.nameParam},
            setIsLoading,
            isAuth: true,
          })
          if(response.status == 201){
            toast.success("Pessoa criada com sucesso.")
            setIsOpen(false)
          }
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
              <Button
                text={t("create")}
                backgroundColor={"quaternary"}
                height={32}
                type="submit"
                isLoading={isLoading}
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
          let data = {
            name: values.nameParam,
            capacity: values.capacity,
          }
          const response = await BaseRequest({
            method: "POST",
            url: "/rooms/register",
            data: data,
            setIsLoading,
            isAuth: true,
          })
          if(response.status == 201){
            toast.success("Cômodo criado com sucesso.")
            setIsOpen(false)
          }
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
                isLoading={isLoading}
              />
            </form>
          </div>
        </section>
      );
    case "activity":
      const validationSchemaActivity = Yup.object().shape({
        nameParam: Yup.string().required(t('requiredField')),
        errorValue: Yup.number()
      .typeError(t("requiredField"))
      .required(t("requiredField"))
      .min(0, t("minValue", { min: 0 }))
      .max(1, t("maxValue", { max: 1 })),
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
          let data = {
            name: values.nameParam,
            errorValue: values.errorValue,
            color: values.color
          }
          const response = await BaseRequest({
            method: "POST",
            url: "/activities/register",
            data: data,
            setIsLoading,
            isAuth: true,
          })
          if(response.status == 201){
            toast.success("Atividade criada com sucesso.")
            setIsOpen(false)
          }
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
                type="number"
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
                isLoading={isLoading}
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
              isLoading={isLoading}
            />
          </div>
        </section>
      );
  }
}
