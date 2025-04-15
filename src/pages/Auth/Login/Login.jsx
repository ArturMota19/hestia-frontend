// Components
import Button from "../../../basics/Button/Button";
// Images
import houseIcon from "../../../assets/icons/house-icon.svg";

// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
//Styles
import s from "./Login.module.scss";
import ThemeToggleButton from "../../../basics/ToggleTheme/ToggleTheme";
import Field from "../../../basics/Field/Field";

export default function Login() {
  const navigate = useNavigate()
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Campo Obrigatório").email("Email inválido"),
    password: Yup.string().required("Campo Obrigatório"),
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

  // TO DO: ADD WRAPPER MAX WIDTH AND HEIGHT

  return (
    <main className={s.wrapperLogin}>
      <ThemeToggleButton/>
      <Helmet>
          <meta charSet="utf-8" />
          <title>HESTIA | Login</title>
      </Helmet>
      <section className={s.hestiaInfoWrapper}>
        <div className={s.titleWrapper}>
          <h1>HESTIA</h1>
        </div>
        <div className={s.inputsWrapper}>
          <h2>Logar-se</h2>
          <Field
            type="text"
            fieldName="email"
            label="Email"
            placeholder="Email"
            formik={formik}
          />
          <Field
            type="text"
            fieldName="password"
            label="Senha"
            placeholder="Senha"
            formik={formik}
          />
          <Button
            text="Entrar"
            height="48px"
            backgroundColor="tertiary"
            doFunction={formik.handleSubmit}
          />
        </div>
      </section>
      <div className={s.houseIconWrapper} >
        <img src={houseIcon} alt="House Icon"/>
      </div>
    </main>
  );
}