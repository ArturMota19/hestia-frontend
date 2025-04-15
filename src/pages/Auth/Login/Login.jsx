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
//Styles
import s from "./Login.module.scss";
import PasswordField from "../../../basics/PasswordField/PasswordField";


export default function Login() {
  const navigate = useNavigate()
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
      console.log(values)
    },
  });

  return (
    <main className={s.wrapperLogin}>
      <ThemeToggleButton/>
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
        <div className={s.inputsWrapper}>
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
            text={t('entry')}
            height="48px"
            backgroundColor="tertiary"
            doFunction={formik.handleSubmit}
          />
          <a className={s.linkForget} href="/register">{t('doRegister')}</a>
        </div>
      </section>
      <div className={s.houseIconWrapper} >
        <img src={houseIcon} alt="House Icon"/>
      </div>
    </main>
  );
}