// Components
import Header from "../../basics/Header/Header";
import Field from "../../basics/Field/Field";
import DropdownField from "../../basics/DropdownField/DropdownField"
// Images
// Imports
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";

//Styles
import s from "./CreatePreset.module.scss";


export default function CreatePreset() {
  const [rooms, setRooms] = useState([]);
  const [graph, setGraph] = useState([]);
  const { t, i18n } = useTranslation();
  // Formik to house name
  const validationSchema = Yup.object().shape({
    presetName: Yup.string().required(t('requiredField')),
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
  // Formik to rooms
  const validationSchemaRooms = Yup.object().shape({
    roomName: Yup.string().required(t('requiredField')),
    roomCapacity: Yup.number().required(t('requiredField')),
    atuators: Yup.array().required(t('requiredField')),
  });
  const formikRooms = useFormik({
    initialValues: {
      roomName: "",
      roomCapacity: "",
      atuators: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values)
    },
  });
  // Formik to Rooms
  const validationSchemaGraph = Yup.object().shape({
    room1: Yup.string().required(t('requiredField')),
    room2: Yup.string().required(t('requiredField')),
    distance: Yup.number().required(t('requiredField')),
  });
  
  // Fake enums and data for rooms and atuators
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
  let fakeEnumRooms = [{
    name: 'Sala',
    id: 'room1',
    capacity: 4,
  },
  {
    name: 'Cozinha',
    id: 'room2',
    capacity: 2,
  },
  {
    name: 'Quarto',
    id: 'room3',
    capacity: 3,
  },
]

  return (
    <main className={s.wrapperCreatePreset}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | Create Preset</title>
      </Helmet>
      <Header/>
      <section className={s.hestiaInfoWrapper}>
        <h1>Criar Preset Casa</h1>
        <div>
          <form>
            <Field
              type="text"
              fieldName="presetName"
              formik={formik}
              isLogged={true}
            />
          </form>
          <h2>Cômodos</h2>
          <form onSubmit={formikRooms.handleSubmit}>
            <div>
              <DropdownField
                type="text"
                fieldName="roomName"
                formik={formikRooms}
                value={formikRooms.values.roomName}
                options={fakeEnumRooms}
                readOnly={false}
              />
              <Field
                type="number"
                fieldName="roomCapacity"
                formik={formikRooms}
                isLogged={true}
              />
              <DropdownField
                type="text"
                fieldName="atuators"
                formik={formikRooms}
                value={formikRooms.values.atuators}
                options={fakeEnumAtuators}
                readOnly={false}
              />
            </div>
            <button type="submit">ADD</button>
          </form>
        </div>
      </section>
    </main>
  );
}