// Components
import Header from "../../../basics/Header/Header";
import Field from "../../../basics/Field/Field";
import DropdownField from "../../../basics/DropdownField/DropdownField";
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
import PersonRoutine from "../../../basics/PersonRoutine/PersonRoutine";
import toast from "react-hot-toast";

export default function CreateRoutine() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weekDay, setWeekDay] = useState("");
  const [person, setPerson] = useState("");
  const [people, setPeople] = useState([]);

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
  ];
  let fakeEnumPersons = [
    { id: "01", name: "Pessoa 1" },
    { id: "02", name: "Pessoa 2" },
    { id: "03", name: "Pessoa 3" },
    { id: "04", name: "Pessoa 4" },
  ];
  const validationSchema = Yup.object().shape({
    preset: Yup.string().required(t("requiredField")),
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
  const validationSchemaPerson = Yup.object().shape({
    person: Yup.string().required(t("requiredField")),
  });
  const formikPerson = useFormik({
    initialValues: {
      person: "",
    },
    validationSchema: validationSchemaPerson,
    onSubmit: async (values) => {
      if (people.length > 0) {
        const filteredPerson = people.filter(
          (people) => people.person === values.person
        );
        if (filteredPerson.length > 0) {
          toast.error(
            `A ${filteredPerson[0].person} já possui uma rotina cadastrada.`,
            {
              duration: 4000,
              position: "top-center",
            }
          );
          return;
        }
      }
      setPeople((prevItems) => [
        ...prevItems,
        {
          person: values.person,
          monday: { dayName: "monday", routine: [] },
          tuesday: { dayName: "tuesday", routine: [] },
          wednesday: { dayName: "wednesday", routine: [] },
          thursday: { dayName: "thursday", routine: [] },
          friday: { dayName: "friday", routine: [] },
          saturday: { dayName: "saturday", routine: [] },
          sunday: { dayName: "sunday", routine: [] },
        },
      ]);
    },
  });

  return (
    <main className={s.wrapperCreateRoutine}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | Create Routine</title>
      </Helmet>
      <Header />
      <RoutineModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        weekDay={weekDay}
        presetName={formikPresets.values.preset}
        person={person}
        people={people}
        setPeople={setPeople}
      />
      <section className={s.hestiaInfoWrapper}>
        <h1>{t("createRoutines")}</h1>
        <div className={s.wrapperInternForm}>
          <div className={s.titleRoutinesCreate}>
            <h2>{t("personsRoutines")}</h2>
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
        {formikPresets.values.preset ? ( // change this to if true after development
          <>
            {people.map((eachPerson) => {
              return (
                <PersonRoutine
                  person={eachPerson}
                  setIsModalOpen={setIsModalOpen}
                  setPerson={setPerson}
                  setWeekDay={setWeekDay}
                  preset={formikPresets.values.preset}
                />
              );
            })}
            <form
              onSubmit={formikPerson.handleSubmit}
              className={s.createButton}>
              <DropdownField
                type="text"
                fieldName="person"
                formik={formikPerson}
                value={formikPerson.values.person}
                options={fakeEnumPersons}
                readOnly={false}
              />
              <Button
                text={t("addPerson")}
                backgroundColor={"secondary"}
                height={48}
              />
            </form>
          </>
        ) : (
          <p className={s.selectOnePreset}>{t("selectOnePreset")}</p>
        )}
      </section>
    </main>
  );
}
