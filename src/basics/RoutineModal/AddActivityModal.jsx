// Components
import Button from "../Button/Button";
import DropdownField from "../DropdownField/DropdownField";
import { useTranslation } from "react-i18next";
// Images

// Imports

import * as Yup from "yup";
import { useFormik } from "formik";
// Styles
import s from './RoutineModal.module.scss'


export default function AddActivityModal({isActivityModalOpen, setIsActivityModalOpen, items, setItems}) {
    if(!isActivityModalOpen) return null;
    const {t} = useTranslation()
    const validationSchema = Yup.object().shape({
      activity: Yup.mixed().required(t('requiredField')),
      actuators: Yup.mixed().required(t('requiredField'))
    });
    const formik = useFormik({
      initialValues: {
        activity: "",
        actuators: "",
      },
      validationSchema,
      onSubmit: async (values) => {
        console.log(values)
        setItems((prevItems) => [
          ...prevItems,
          {
            id: prevItems.length + 1,
            title: values.activity,
            start: 0,
            duration: 1,
          },
        ]);
        console.log(items, values)
        setIsActivityModalOpen(false);
      },
    });
    const fakeEnumActivities = [
      { id: 1, name: "Dormir", errorRate: 0.1, color: "#F34DDD" },
      { id: 2, name: "Tomar Banho", errorRate: 0.05, color: "#4DA6FF" },
      { id: 3, name: "Ver televisão", errorRate: 0.2, color: "#FFD700" },
      { id: 4, name: "Fazer tal Coisa", errorRate: 0.15, color: "#32CD32" },
      { id: 5, name: "Ler um Livro", errorRate: 0.08, color: "#FF4500" },
      { id: 6, name: "Cozinhar", errorRate: 0.12, color: "#8A2BE2" },
      { id: 7, name: "Estudar", errorRate: 0.07, color: "#00CED1" },
      { id: 8, name: "Exercitar-se", errorRate: 0.09, color: "#FF6347" },
      { id: 9, name: "Meditar", errorRate: 0.03, color: "#6A5ACD" },
      { id: 10, name: "Jogar Video Game", errorRate: 0.18, color: "#FF69B4" },
      { id: 11, name: "Fazer Compras", errorRate: 0.11, color: "#20B2AA" },
      { id: 12, name: "Passear com o Cachorro", errorRate: 0.06, color: "#FFDAB9" },
    ];
  
    let fakeEnumAtuators = [{
      name: 'Cafeteira',
      id: 'atuador1',
    },
    {
      name: 'Lâmpada',
      id: 'atuador3',
    },
    {
      name: 'Ar Condicionado',
      id: 'atuador2',
    },
    ]
  return (
        <form className={s.activityForm} onSubmit={formik.handleSubmit}>
          <h4>{t('addAnActivity')}</h4>
          <div className={s.wrapperInputs}>
            <DropdownField
              type="text"
              fieldName="activity"
              formik={formik}
              value={formik.values.activity}
              options={fakeEnumActivities}
              readOnly={false}
            />
            <DropdownField
              type="text"
              fieldName="actuators"
              formik={formik}
              value={formik.values.actuators}
              options={fakeEnumAtuators}
              readOnly={false}
              isMultiSelect={true}
            />
          </div>
          <div className={s.arrayButtons}>
            <Button
                type="button"
                text={t('cancel')}
                backgroundColor={"secondary"}
                height={42}
                doFunction={() => {
                  setIsActivityModalOpen(false);
                }}
              />
            <Button
                type="button"
                text={t('save')}
                backgroundColor={"primary"}
                height={42}
              />
          </div>
        </form>
  );
}