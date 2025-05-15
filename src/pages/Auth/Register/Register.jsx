// Components
import Button from "../../../basics/Button/Button";
import PasswordField from "../../../basics/PasswordField/PasswordField";
import LanguageToggleButton from "../../../basics/LanguageToggleButton/LanguageToggleButton";
import ThemeToggleButton from "../../../basics/ToggleTheme/ToggleTheme";
import Field from "../../../basics/Field/Field";
// Images
import houseIcon from "../../../assets/icons/house-icon.svg";

// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { BaseRequest } from "../../../services/BaseRequest";
//Styles
import s from "./Register.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { t, i18n } = useTranslation();
  const validationSchema = Yup.object().shape({
    email: Yup.string().required(t('requiredField')).email(t('invalidEmail')),
    password: Yup.string().required(t('requiredField')),
    confirmpassword: Yup.string()
      .required(t('requiredField'))
      .oneOf([Yup.ref("password"), null], t("passwordMismatch")),
    name: Yup.string().required(t('requiredField')),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmpassword: "",
      name: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      let data = {
        name: values.name,
        email: values.email,
        password: values.password
      }
      const response = await BaseRequest({
        method: "POST",
        url: "/auth/register",
        data: data,
        setIsLoading,
      })
      if(response.status == 201){
        toast.success("Conta criada com sucesso.", {
          duration: 2500,
        });
        setTimeout(() => {
          navigate("/login")
        }, 2500)
        
      }
    },
  });

  return (
    <main className={s.wrapperRegister}>
      <ThemeToggleButton isHeader={false}/>
      <div className={"languageToggleButtonWrapper"}>
        <LanguageToggleButton/>
      </div>
      <Helmet>
          <meta charSet="utf-8" />
          <title>HESTIA | Register</title>
      </Helmet>
      <section className={s.hestiaInfoWrapper}>
        <div className={s.titleWrapper}>
          <h1>HESTIA</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className={s.inputsWrapper}>
          <h2>{t('register')}</h2>
          <Field
            type="text"
            fieldName="name"
            formik={formik}
          />
          <Field
            type="text"
            fieldName="email"
            formik={formik}
          />
          <PasswordField
            id="password"
            fieldName="password"
            formik={formik}
            toggleMask={true}
            passwordPanel={true}
            readOnly={false}
          />
          <PasswordField
            id="confirmpassword"
            fieldName="confirmpassword"
            formik={formik}
            toggleMask={true}
            readOnly={false}
          />
          <Button
            type="button"
            text={t('createAccount')}
            height="48px"
            backgroundColor="tertiary"
            doFunction={() => formik.handleSubmit()}
            isLoading={isLoading}
          />
          <a className={s.linkForget} href="/login">{t('doLogin')}</a>
        </form>
      </section>
      <div className={s.houseIconWrapper} >
        <img src={houseIcon} alt="House Icon"/>
      </div>
    </main>
  );
}