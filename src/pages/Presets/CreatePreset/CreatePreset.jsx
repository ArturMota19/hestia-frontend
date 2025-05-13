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
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import {BaseRequest} from '../../../services/BaseRequest'
//Styles
import s from "./CreatePreset.module.scss";


export default function CreatePreset() {
  const [rooms, setRooms] = useState([]);
  const [graph, setGraph] = useState([]);
  const [enumRooms, setEnumRooms] = useState([])
  const [enumActuators, setEnumActuators] = useState([])
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
      if(rooms.length === 0) {
        toast.error('Cadastre ao menos um cômodo para continuar!',{
          duration: 4000,
          position: 'top-center',
        });
        return;
      }
      if(graph.length === 0) {
        toast.error('Cadastre ao menos um cômodo para continuar!',{
          duration: 4000,
          position: 'top-center',
        });
        return;
      }
      console.log(values, rooms, graph);
    },
  });
  // Formik to rooms
  const validationSchemaRooms = Yup.object().shape({
    roomName: Yup.object()
      .nullable()
      .required('Campo obrigatório'),
    roomCapacity: Yup.number().required(t('requiredField')),
    atuators: Yup.array()
    .min(1, t('requiredField'))
  });
  const formikRooms = useFormik({
    initialValues: {
      roomName: null,
      roomCapacity: "",
      atuators: [],
    },
    validationSchema: validationSchemaRooms,
    onSubmit: async (values) => {
      if(rooms.some(room => room.roomName === values.roomName)){
        toast.error("Cômodo já adicionado.")
        return
      }
      setRooms([...rooms, values]);
      formikRooms.resetForm();
    },
  });
  // Formik to Rooms
  const validationSchemaGraph = Yup.object().shape({
    room1: Yup.string().required(t('requiredField')),
    room2: Yup.string().required(t('requiredField')),
    distance: Yup.number().required(t('requiredField')),
  });
  const formikGraph = useFormik({
    initialValues: {
      room1: "",
      room2: "",
      distance: "",
    },
    validationSchema: validationSchemaGraph,
    onSubmit: async (values) => {
      setGraph([...graph, values]);
      formikGraph.resetForm();
    },
  });
  
  async function FetchData(){
    const responseRooms = await BaseRequest({
      method: "GET",
      url: "/rooms/getSelf",
      isAuth: true
    })
    if(responseRooms.status == 200){
      setEnumRooms(responseRooms.data.rooms)
    }
    const responseActuators = await BaseRequest({
      method: "GET",
      url: "/actuators/getAllWithoutPagination",
      isAuth: true
    })
    if(responseActuators.status == 200){
      setEnumActuators(responseActuators.data.actuators)
    }
    
  }

  useEffect(() => {
    FetchData()
  },[])

  useEffect(() => {
    if(formikRooms.values.roomName){
      formikRooms.setFieldValue("roomCapacity", formikRooms.values.roomName.capacity)
    }
  }, [formikRooms.values.roomName])
  
  return (
    <main className={s.wrapperCreatePreset}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | Create Preset</title>
      </Helmet>
      <Header/>
      <section className={s.hestiaInfoWrapper}>
        <h1>{t('createHousePreset')}</h1>
        <div className={s.wrapperInternForm}>
          <form>
            <Field
              type="text"
              fieldName="presetName"
              formik={formik}
              isLogged={true}
            />
          </form>
          <form className={s.wrapperForm} onSubmit={formikRooms.handleSubmit}>
            <h2>{t('rooms')}</h2>
            {rooms && rooms.length > 0 && 
              rooms.map((room, index) => (
                <div key={index} className={s.wrapperThreeInputs}>
                  <Field
                    type="text"
                    fieldName="roomName"
                    readOnly={true}
                    isLogged={true}
                    value={room.roomName.name}
                  />
                  <Field
                    type="text"
                    fieldName="roomCapacity"
                    isLogged={true}
                    readOnly={true}
                    value={room.roomCapacity}
                  />
                  <Field
                    type="text"
                    fieldName="atuators"
                    isLogged={true}
                    readOnly={true}
                    value={room.atuators.map((atuator) => atuator.name).join(", ")}
                  />
                </div>
              ))
            }
            <div className={s.wrapperThreeInputs}>
              <DropdownField
                type="text"
                fieldName="roomName"
                formik={formikRooms}
                value={formikRooms.values.roomName}
                options={enumRooms}
                readOnly={false}
              />
              <Field
                type="number"
                fieldName="roomCapacity"
                formik={formikRooms}
                readOnly={true}
                isLogged={true}
              />
              <DropdownField
                type="text"
                fieldName="atuators"
                formik={formikRooms}
                value={formikRooms.values.atuators}
                options={enumActuators}
                readOnly={false}
                isMultiSelect={true}
              />
            </div>
            <div className={s.buttonsDiv}>
              <Button 
                text={t('addRoom')} 
                type="submit"
                backgroundColor={"quaternary"} 
                height={32}
              />
              <Button 
                text={t('removeRoom')} 
                backgroundColor={"delete"} 
                height={32}
                doFunction={() => {
                    if (rooms.length > 0) {
                    setRooms(rooms.slice(0, -1));
                    }
                }}
              />
            </div>
          </form>
          {rooms.length > 1 ?
          <form className={s.wrapperForm} onSubmit={formikGraph.handleSubmit}>
            <h2>{t('graph')}</h2>
            {graph && graph.length > 0 && 
              graph.map((graph, index) => (
                <div className={s.wrapperThreeInputs}>
                  <Field
                    type="text"
                    fieldName="room1"
                    readOnly={true}
                    isLogged={true}
                    value={graph.room1}
                  />
                  <Field
                    type="text"
                    fieldName="distance"
                    isLogged={true}
                    readOnly={true}
                    value={graph.distance}
                  />
                  <Field
                    type="text"
                    fieldName="room2"
                    readOnly={true}
                    isLogged={true}
                    value={graph.room2}
                  />
                </div>
              ))
            }
            <div className={s.wrapperThreeInputs}>
              <DropdownField
                type="text"
                fieldName="room1"
                formik={formikGraph}
                value={formikGraph.values.room1}
                options={enumRooms}
                readOnly={false}
              />
              <Field
                type="number"
                fieldName="distance"
                formik={formikGraph}
                isLogged={true}
              />
              <DropdownField
                type="text"
                fieldName="room2"
                formik={formikGraph}
                value={formikGraph.values.room2}
                options={enumRooms}
                readOnly={false}
              />
            </div>
            <div className={s.buttonsDiv}>
              <Button 
                text={t('addGraph')} 
                type="submit"
                backgroundColor={"quaternary"} 
                height={32}
              />
              <Button 
                text={t('removeGraph')} 
                backgroundColor={"delete"} 
                height={32}
                doFunction={() => {
                    if (graph.length > 0) {
                    setGraph(graph.slice(0, -1));
                    }
                }}
              />
            </div>
          </form>
          :
          <div>
            <p className={s.errorNoGraph}>{t('addMoreRooms')} </p>
          </div>
          }
        </div>
        <div className={s.createButton}>
          <Button 
            text={t('create')} 
            backgroundColor={"primary"} 
            height={48}
            doFunction={() => {
              formik.handleSubmit();
          }}
          />
        </div>
      </section>
    </main>
  );
}