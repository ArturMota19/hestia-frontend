// Components
import Button from "../../../basics/Button/Button";
// Images
import houseIcon from "../../../assets/house-icon.svg"

// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
//Styles
import s from "./Register.module.scss";
import ThemeToggleButton from "../../../basics/ToggleTheme/ToggleTheme";
import Field from "../../../basics/Field/Field";
import PasswordField from "../../../basics/PasswordField/PasswordField";

export default function Register() {
  const navigate = useNavigate()
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Campo Obrigatório").email("Email inválido"),
    password: Yup.string().required("Campo Obrigatório"),
    confirmpassword: Yup.string()
      .required("Campo Obrigatório")
      .oneOf([Yup.ref("password"), null], "As senhas não coincidem"),
    name: Yup.string().required("Campo Obrigatório"),
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
      console.log(values)
    },
  });

  // TO DO: ADD WRAPPER MAX WIDTH AND HEIGHT

  return (
    <main className={s.wrapperRegister}>
      <ThemeToggleButton/>
      <Helmet>
          <meta charSet="utf-8" />
          <title>HESTIA | Register</title>
      </Helmet>
      <section className={s.hestiaInfoWrapper}>
        <div className={s.titleWrapper}>
          <h1>HESTIA</h1>
        </div>
        <div className={s.inputsWrapper}>
          <h2>Registrar-se</h2>
          <Field
            type="text"
            fieldName="name"
            label="Nome"
            placeholder="Nome"
            formik={formik}
          />
          <Field
            type="text"
            fieldName="email"
            label="Email"
            placeholder="Email"
            formik={formik}
          />
          <PasswordField
            id="password"
            fieldName="password"
            label="Senha"
            placeholder="Senha"
            formik={formik}
            toggleMask={true}
            passwordPanel={true}
            readOnly={false}
          />
          <PasswordField
            id="confirmpassword"
            fieldName="confirmpassword"
            label="Confirmar Senha"
            placeholder="Confirmar Senha"
            formik={formik}
            toggleMask={true}
            readOnly={false}
          />
          <Button
            text="Criar Conta"
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