// Components
import Header from "../../../basics/Header/Header";
import Field from "../../../basics/Field/Field";
import DropdownField from "../../../basics/DropdownField/DropdownField"
import Button from "../../../basics/Button/Button";
// Images
// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
//Styles
import s from "./CreateRoutine.module.scss";
import RoutineModal from "../../../basics/RoutineModal/RoutineModal";
import { useState } from "react";


export default function CreateRoutine() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);

  let fakeEnumPresets = [
    { id: "preset1", name: "Preset 1" },
    { id: "preset2", name: "Preset 2" },
    { id: "preset3", name: "Preset 3" },
    { id: "preset4", name: "Preset 4" },
    { id: "preset5", name: "Preset 5" },
    { id: "preset6", name: "Preset 6" },
    { id: "preset7", name: "Preset 7" },
    { id: "preset8", name: "Preset 8" },
    { id: "preset9", name: "Preset 9" },
    { id: "preset10", name: "Preset 10" },
  ]
  const validationSchema = Yup.object().shape({
    preset: Yup.string().required(t('requiredField')),
  });
  const formikPresets = useFormik({
    initialValues: {
      preset: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <main className={s.wrapperCreateRoutine}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | Create Routine</title>
      </Helmet>
      <Header/>
      <RoutineModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      <section className={s.hestiaInfoWrapper}>
        <h1>{t('createRoutines')}</h1>
        <div className={s.wrapperInternForm}>
          <div className={s.titleRoutinesCreate}>
            <h2>{t('personsRoutines')}</h2>
            <div className={s.inputWrapperDropdown}>
              <DropdownField
                type="text"
                fieldName="preset"
                formik={formikPresets}
                value={formikPresets.values.preset}
                options={fakeEnumPresets}
                readOnly={false}
              />
            </div>
          </div>
        </div>
        <div className={s.createButton}>
          <Button 
            text={t('addPerson')} 
            backgroundColor={"secondary"} 
            height={48}
            doFunction={() => {console.log("oi")}}
          />
        </div>
      </section>
    </main>
  );
}