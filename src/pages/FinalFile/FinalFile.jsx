// Components
import Header from "../../basics/Header/Header";
import DropdownField from "../../basics/DropdownField/DropdownField";
import Button from "../../basics/Button/Button";
// Images
// Imports
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BaseRequest } from "../../services/BaseRequest";
//Styles
import s from "./FinalFile.module.scss";

export default function FinalFile() {
  const [isLoading, setIsLoading] = useState(false)
  const { t, i18n } = useTranslation();
  // Formik to house name
  const validationSchema = Yup.object().shape({
    presetName: Yup.string().required(t("requiredField")),
  });
  const formik = useFormik({
    initialValues: {
      presetName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values)
    },
  });

  return (
    <main className={s.wrapperFinalFile}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | Create Final File</title>
      </Helmet>
      <Header />
      <section className={s.hestiaInfoWrapper}>
        <h1>{t("createFinalFile")}</h1>
        <div className={s.wrapperInternForm}>
          <form>
          </form>
        </div>
      </section>
    </main>
  );
}
