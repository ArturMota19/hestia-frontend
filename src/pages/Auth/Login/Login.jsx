// Components
import Button from "../../../basics/Button/Button";
import ThemeToggleButton from "../../../basics/ToggleTheme/ToggleTheme";
import Field from "../../../basics/Field/Field";
import LanguageToggleButton from "../../../basics/LanguageToggleButton/LanguageToggleButton";
// Images
import houseIcon from "../../../assets/icons/house-icon.svg";

// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {BaseRequest} from "../../../services/BaseRequest"
//Styles
import s from "./Login.module.scss";
import PasswordField from "../../../basics/PasswordField/PasswordField";
import { useState } from "react";
import toast from "react-hot-toast";


export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { t, i18n } = useTranslation();
  const validationSchema = Yup.object().shape({
    email: Yup.string().required(t('requiredField')).email(t('invalidEmail')),
    password: Yup.string().required(t('requiredField')),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      let data = {
        email: values.email,
        password: values.password
      }
      const response = await BaseRequest({
        method: "POST",
        url: "/auth/login",
        data: data,
        setIsLoading
      })

      if(response.status == 200){
        toast.success("Login efetuado com sucesso.", {
          duration: 1000,
        });
        localStorage.setItem("AHtoken", response.data.token)
        setTimeout(() => {
          navigate("/home")
        }, 1000)
        
      }
    },
  });

  return (
    <main className={s.wrapperLogin}>
      <ThemeToggleButton isHeader={false}/>
      <div className={"languageToggleButtonWrapper"}>
        <LanguageToggleButton/>
      </div>
      <Helmet>
          <meta charSet="utf-8" />
          <title>HESTIA | Login</title>
      </Helmet>
      <section className={s.hestiaInfoWrapper}>
        <div className={s.titleWrapper}>
          <h1>HESTIA</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className={s.inputsWrapper}>
          <h2>{t('login')}</h2>
          <Field
            type="text"
            fieldName="email"
            formik={formik}
          />
          <PasswordField
            type="text"
            fieldName="password"
            formik={formik}
            toggleMask={true}
            readOnly={false}
          />
          <Button
            type="submit"
            text={t('entry')}
            height="48px"
            backgroundColor="tertiary"
            doFunction={() => {}}
            isLoading={isLoading}
          />
          <a className={s.linkForget} href="/register">{t('doRegister')}</a>
        </form>
      </section>
      <div className={s.houseIconWrapper} >
        <img src={houseIcon} alt="House Icon"/>
      </div>
    </main>
  );
}