// Components
import Header from "../../basics/Header/Header";
import Field from "../../basics/Field/Field";
// Images
// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
//Styles
import s from "./CreatePreset.module.scss";
import { useFormik } from "formik";


export default function CreatePreset() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const validationSchema = Yup.object().shape({
    presetName: Yup.string().required(t('requiredField')),
    // atuators
    password: Yup.string().required(t('requiredField')),
    // rooms
    // graphs
  });
  const formik = useFormik({
    initialValues: {
      presetName: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values)
    },
  });

  return (
    <main className={s.wrapperCreatePreset}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | Create Preset</title>
      </Helmet>
      <Header/>
      <section className={s.hestiaInfoWrapper}>
        <h1>Criar Preset Casa</h1>
        <form>
          <div>
            <Field
              type="text"
              fieldName="presetName"
              formik={formik}
              isLogged={true}
            />
          </div>
          <h2>Atuadores</h2>
          <div>
            <Field
              type="text"
              fieldName="email"
              formik={formik}
              isLogged={true}
            />
          </div>
        </form>
      </section>
    </main>
  );
}