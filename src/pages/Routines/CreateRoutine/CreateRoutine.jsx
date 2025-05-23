// Components
import Header from "../../../basics/Header/Header";
import Field from "../../../basics/Field/Field";
import DropdownField from "../../../basics/DropdownField/DropdownField";
import Button from "../../../basics/Button/Button";
// Images
import { FaLockOpen, FaLock } from "react-icons/fa6";
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
  const [hasToSavePeople, setHasToSavePeople] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [blockPreset, setBlockPreset] = useState(false)

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

  async function FetchAllRoutinesDays(){
    if(!formikPresets.values.preset || people.length == 0 || hasToSavePeople) return
    const arrayIds = []
    for(const person of people){
      arrayIds.push(person.peopleRoutineId)
    }
    const data = {
      peopleRoutinesIds: arrayIds
    }
    const response = await BaseRequest({
      method: "POST",
      url: `routines/getAllRoutinesDays`,
      data,
      isAuth: true,
      setIsLoading,
    })
    if(response.status == 200){
      setPeople(response.data)
      setHasToSavePeople(true)
    }
  }

  useEffect(() => {
    if (formikPresets.values.preset && people.length > 0) {
      FetchAllRoutinesDays();
    }
  },[formikPresets.values.preset, people, isModalOpen, hasToSavePeople])

  async function AddPeopleGraph(array){
    if(people.length > 0){
      const filteredPeople = people.filter((person) => person.peopleId === array.peopleId)
      if(filteredPeople.length > 0 ){
        return
      }
    }
    
    setPeople((prevItems) => [
      ...prevItems,
      {
        peopleRoutineId: array.id,
        peopleId: array.peopleId,
        peopleName: array.peopleName,
        monday: { dayName: "monday", dayId: array.mondayRoutineId, routine: [] },
        tuesday: { dayName: "tuesday", dayId: array.tuesdayRoutineId, routine: [] },
        wednesday: { dayName: "wednesday", dayId: array.wednesdayRoutineId, routine: [] },
        thursday: { dayName: "thursday", dayId: array.thursdayRoutineId, routine: [] },
        friday: { dayName: "friday", dayId: array.fridayRoutineId, routine: [] },
        saturday: { dayName: "saturday", dayId: array.saturdayRoutineId, routine: [] },
        sunday: { dayName: "sunday", dayId: array.sundayRoutineId, routine: [] },
      },
    ]);
  }

  async function GetCreatedRoutines(){
    if(formikPresets.values.preset == ""){
      return
    }
    const response = await BaseRequest({
      method: "GET",
      url: `routines/getPeopleRoutinesByPresetId/${formikPresets.values.preset.id}`,
      isAuth: true,
      setIsLoading
    })
    if(response.status == 200){
      if(response.data.length == 0){
        setPeople([])
            setHasToSavePeople(false)
        return
      }
      response.data.map((personRoutine) => {
        AddPeopleGraph(personRoutine)
      })

    }
  }

  useEffect(() => {
    if(formikPresets.values.preset != ""){
      setBlockPreset(true)
    }
    GetCreatedRoutines()
    
  }, [formikPresets.values.preset])

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
  }, [formikPresets.values.preset])


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
          (people) => people.peopleId === values.person.id
        );
        if (filteredPerson.length > 0) {
          toast.error(
            `A ${filteredPerson[0].peopleId} já possui uma rotina cadastrada.`,
            {
              duration: 4000,
              position: "top-center",
            }
          );
          return;
        }
      }
      let data = {
        personId: values.person.id,
        housePresetId: formikPresets.values.preset.id
      }
      const response = await BaseRequest({
        method: "POST",
        url: "routines/registerPeopleDayRoutines",
        data,
        setIsLoading,
        isAuth: true
      })
      if(response.status == 201){
        AddPeopleGraph(response.data.peopleRoutines)
      }
      
    },
  });


  async function ResetPreset(){
    setPeople([])
    setEnumPeople([])
    setHasToSavePeople(false)
    setPerson("")
    setBlockPreset(false)
    formikPerson.resetForm()
    formikPresets.resetForm()

  }

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
        preset={formikPresets.values.preset}
        person={person}
        people={people}
        setPeople={setPeople}
        setHasToSavePeople={setHasToSavePeople}
      />
      <section className={s.hestiaInfoWrapper}>
        <h1>{t("createRoutines")}</h1>
        <div className={s.wrapperInternForm}>
          <div className={s.titleRoutinesCreate}>
            <h2>{t("personsRoutines")}</h2>
            <div className={s.inputWrapperDropdown}>
              {blockPreset ? <FaLock style={{cursor: "pointer"}} onClick={() => ResetPreset()} size={25}/> : <FaLockOpen size={28}/>}
              <DropdownField
                type="text"
                fieldName="preset"
                formik={formikPresets}
                value={formikPresets.values.preset}
                options={presets}
                readOnly={blockPreset}
              />
            </div>
          </div>
        </div>
        {formikPresets.values.preset ? (
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
