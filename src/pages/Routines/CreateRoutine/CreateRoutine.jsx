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
import { useEffect, useState } from "react";
import PersonRoutine from "../../../basics/PersonRoutine/PersonRoutine";
import toast from "react-hot-toast";
import { BaseRequest } from "../../../services/BaseRequest";

export default function CreateRoutine() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weekDay, setWeekDay] = useState("");
  const [person, setPerson] = useState("");
  const [people, setPeople] = useState([]);
  const [presets, setPresets] = useState([])
  const [enumPeople, setEnumPeople] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  async function GetPresets(){
    const response = await BaseRequest({
      method: "GET",
      url: `presets/getAllWithoutPage`,
      isAuth: true,
      setIsLoading
    })
    if(response.status == 200){
      setPresets(response.data.presetData)
    }
  }

  useEffect(() => {
    GetPresets()
  },[])

  async function GetPeople(){
      const response = await BaseRequest({
      method: "GET",
      url: `people/getAllWithoutPage`,
      isAuth: true,
      setIsLoading
    })
    if(response.status == 200){
      setEnumPeople(response.data.peopleData)
    }
  }

  useEffect(() => {
    GetPeople()
  }, [presets])

  const validationSchema = Yup.object().shape({
    preset: Yup.mixed().required(t("requiredField")),
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
    person: Yup.mixed().required(t("requiredField")),
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
        presetName={formikPresets.values.preset.name}
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
                options={presets}
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
                options={enumPeople}
                readOnly={false}
              />
              <Button
                type="submit"
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
