// Components
import Header from "../../basics/Header/Header";
import DropdownField from "../../basics/DropdownField/DropdownField";
import Button from "../../basics/Button/Button";
// Images
import { IoMdAdd } from "react-icons/io";
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
import Field from "../../basics/Field/Field";

export default function FinalFile() {
  const [isLoading, setIsLoading] = useState(false);
  const [presets, setPresets] = useState([]);
  const [peopleRoutines, setPeopleRoutines] = useState([])
  const [preferenceData, setPreferenceData] = useState([])
  const [enumActivities, setEnumActivities] = useState([]);
  const [actuatorsProps, setActuatorsProps] = useState([]);
  const [otherActivities, setOtherActivities] = useState([]);
  const { t } = useTranslation();

    const actuatorStatusMap = {
    LAMPADA: [
      { name: "switch_led", type: "boolean" },
      { name: "bright_value_v2", type: "range", min: 0, max: 1000 },
      { name: "temp_value_v2", type: "range", min: 0, max: 1000 },
    ],
    CAFETEIRA: [{ name: "switch", type: "boolean" }],
    PLUG: [{ name: "switch_1", type: "boolean" }],
    SOM: [
      { name: "switch", type: "boolean" },
      { name: "sound_volume", type: "range", min: 0, max: 100 },
    ],
    AR_CONDICIONADO: [
      { name: "switch", type: "boolean" },
      { name: "temp_set", type: "range", min: 16, max: 30 },
      {
        name: "mode",
        type: "enum",
        options: ["COLL", "HOT", "WET", "WIND", "AUTO"],
      },
    ],
    TV: [
      { name: "switch", type: "boolean" },
      { name: "sound_volume", type: "range", min: 0, max: 100 },
    ],
    SENSOR_PRESENCA: [
      { name: "presence_state", type: "boolean" },
      {
        name: "human_motion_state",
        type: "enum",
        options: ["NONE", "SMALL_MOVE", "LARGER_MOVE"],
      },
    ],
  };

    function CheckValidProps(values) {
    const actuatorName = values.actuator.name;
    const statusProps = values.status;
    const expectedProps = actuatorStatusMap[actuatorName];

    if (!expectedProps) {
      return { error: "unknownActuator" };
    }

    for (const prop of statusProps) {
      const expectedProp = expectedProps.find((p) => p.name === prop.name);

      if (!expectedProp) {
        return { error: `unknownProp: ${prop.name}` };
      }

      const inputIntValue = parseInt(prop.value);

      if (expectedProp.type === "boolean") {
        if (typeof prop.value !== "boolean") {
          return { error: `invalidType: ${prop.name} should be boolean` };
        }
      } else if (expectedProp.type === "range") {
        if (
          inputIntValue < expectedProp.min ||
          inputIntValue > expectedProp.max
        ) {
          return {
            error: `outOfRange: ${prop.name} should be between ${expectedProp.min} and ${expectedProp.max}`,
          };
        }
      } else if (expectedProp.type === "enum") {
        if (!expectedProp.options.includes(prop.value)) {
          return {
            error: `invalidOption: ${
              prop.name
            } should be one of ${expectedProp.options.join(", ")}`,
          };
        }
      } else {
        return { error: `unknownType: ${expectedProp.type}` };
      }
    }

    return { valid: true };
  }

  function transformToSimulator(responseData) {
    setIsLoading(true)
    try {
      if(!responseData){
        toast.error("Houve um problema ao tratar os dados iniciais.");
        return
      }
      // 1- ATUADORES
      const ATUADORES = [];
      responseData[0].actuators.forEach((element) => {
        ATUADORES.push(element.name);
      });

      // 2. COMODOS
      const COMODOS = {
        rua: {
          nome: "RUA",
          atuadores: [],
          ocupacao_maxima: 10
        }
      };

      const sourceRooms = (responseData.find(item => item.rooms)?.rooms) || [];
      sourceRooms.forEach(roomEntry => {
        const originalRoomName = roomEntry.room.name;
        const roomKey = originalRoomName.toLowerCase().replace(/\s+/g, '_');
        const formattedRoomName = originalRoomName.toUpperCase().replace(/\s+/g, '_');
        COMODOS[roomKey] = {
          nome: formattedRoomName,
          atuadores: roomEntry.roomactuators.map(ra => ra.actuator.name.toUpperCase()),
          ocupacao_maxima: roomEntry.room.capacity
        };
      });

      // 3. GRAFO_COMODOS
      const GRAFO_COMODOS = [];
      const firstRealRoomKey = Object.keys(COMODOS).find(key => key !== 'rua');
      if (firstRealRoomKey) {
        GRAFO_COMODOS.push(["RUA", COMODOS[firstRealRoomKey].nome, 5]);
      }
      const sourceGraph = (responseData.find(item => item.graph)?.graph) || [];
      sourceGraph.forEach(connection => {
        const originName = connection.originHouseRoom.room.name.toUpperCase().replace(/\s+/g, '_');
        const destinationName = connection.destinationHouseRoom.room.name.toUpperCase().replace(/\s+/g, '_');
        GRAFO_COMODOS.push([originName, destinationName, connection.distance]);
      });

      // 4. ATIVIDADES
      const ATIVIDADES = {};
      const scheduledActivities = (responseData.find(item => item.activities)?.activities) || [];
      const calcularDuracaoEmMinutos = (startTime, endTime) => {
        const [sH, sM, sS] = startTime.split(':').map(Number);
        const [eH, eM, eS] = endTime.split(':').map(Number);
        let startTotalMinutes = sH * 60 + sM + sS / 60;
        let endTotalMinutes = eH * 60 + eM + eS / 60;
        if (endTotalMinutes < startTotalMinutes) {
          endTotalMinutes = 24 * 60;
        }
        if (endTime === "24:00:00") {
          endTotalMinutes = 24 * 60;
        }
        return Math.round(endTotalMinutes - startTotalMinutes);
      };

      scheduledActivities.forEach((scheduledActivity, index) => {
        const assoc = scheduledActivity.activityPresetParamAssociation;
        const activityBaseName = assoc.activity.name.toUpperCase().replace(/\s+/g, '_');
        const roomOriginalName = assoc.houserooms.room.name;
        const roomFormattedName = roomOriginalName.toUpperCase().replace(/\s+/g, '_');
        const duration = calcularDuracaoEmMinutos(scheduledActivity.startTime, scheduledActivity.endTime);
        const activityKey = `${activityBaseName}_${roomFormattedName}_${duration}MIN${index}`;

        // Monta lista_atuadores_atividade
        const atuadoresAtividade = {};
        assoc.actuatorsActivity.forEach(actuatorDetail => {
          const actuatorName = actuatorDetail.actuator.name.toUpperCase();
          let estado = "OFF";
          if (actuatorDetail.hasOwnProperty('switch_1') && actuatorDetail.switch_1 === "ON") estado = "ON";
          else if (actuatorDetail.hasOwnProperty('switch') && actuatorDetail.switch === "ON") estado = "ON";
          else if (actuatorDetail.hasOwnProperty('switch_led') && actuatorDetail.switch_led === "ON") estado = "ON";
          // 50% chance de ser "P" ou "D"
          const comportamento = Math.random() < 0.5 ? "P" : "D";
          atuadoresAtividade[actuatorName] = [estado, comportamento];
        });

        // Monta atividades_associadas
        const atividadesAssociadas = {};
        if (assoc.otherActivities && Array.isArray(assoc.otherActivities)) {
          assoc.otherActivities.forEach(otherAct => {
        const otherActName = otherAct.activity.name.toUpperCase().replace(/\s+/g, '_');
        atividadesAssociadas[otherActName] = otherAct.probability;

        // Se a atividade associada não existe, cria uma default
        if (!ATIVIDADES[otherActName]) {
            ATIVIDADES[otherActName] = {
            nome: otherActName,
            inicio_ocorrencia: null,
            fim_ocorrencia: null,
            duracao: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
            taxa_erro: otherAct.probability,
            local_atividade: "",
            atividades_associadas: {},
            lista_atuadores_atividade: {}
            };
        }
          });
        }

        ATIVIDADES[activityKey] = {
          nome: activityKey,
          inicio_ocorrencia: null,
          fim_ocorrencia: null,
          duracao: duration,
          taxa_erro: assoc.activity.errorValue,
          local_atividade: roomFormattedName,
          atividades_associadas: atividadesAssociadas,
          lista_atuadores_atividade: atuadoresAtividade
        };
      });

      // 6. AUTOMACAO
      const AUTOMACAO = [];

      // 7. Retorno final
      const finalData = {
        ATUADORES,
        COMODOS,
        GRAFO_COMODOS,
        ATIVIDADES,
        // USUARIOS,
        AUTOMACAO
      };
      console.log(finalData)

      // Cria o blob e dispara o download
      const blob = new Blob([JSON.stringify(finalData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "finalFile.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  async function GetPresets() {
    const response = await BaseRequest({
      method: "GET",
      url: `presets/getAllWithoutPage`,
      isAuth: true,
      setIsLoading,
    });
    if (response.status == 200) {
      setPresets(response.data.presetData);
    }
  }

  useEffect(() => {
    GetPresets();
  }, []);

  const validationSchemaPresets = Yup.object().shape({
    preset: Yup.mixed().required(t("requiredField")),
  });
  const formikPresets = useFormik({
    initialValues: {
      preset: "",
    },
    validationSchema: validationSchemaPresets,
    onSubmit: async (values) => {
      const response = await BaseRequest({
        method: "GET",
        url: `/final-file/generateFinalFile/${values.preset.id}`,
        setIsLoading,
        isAuth: true,
      });
      if (response.status == 200) {
        transformToSimulator(response.data.finalData);
      }
    },
  });

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
      console.log(response)
      setPeopleRoutines(response.data)
    }
  }

  useEffect(() => {
    if(formikPresets.values.preset != ""){
      GetCreatedRoutines()
    }
  },[formikPresets.values.preset])

  const PeoplePreferences = ({person, index}) => {
    const [preferencesToThisPerson, setPreferencesToThisPerson] = useState([])
    const validationSchemaPreferences = Yup.object().shape({
      priority: Yup.number().min(1, "Min 1").required(t("requiredField")),
    });
    const formikPreferences = useFormik({
      initialValues: {
          priority: "",
        },
        validationSchema: validationSchemaPreferences,
        onSubmit: async (values) => {
          console.log(values)
        },
      });
    const validationSchemaPreferencesRooms = Yup.object().shape({
      priority: Yup.number().min(1, "Min 1").required(t("requiredField")),
    });

    const formikPreferencesRooms = useFormik({
      initialValues: {
          priority: "",
        },
        validationSchema: validationSchemaPreferencesRooms,
        onSubmit: async (values) => {
          console.log(values)
        },
    });
    
  const validationSchema = Yup.object().shape({
    activityPresetName: Yup.string().required(t("requiredField")),
    activity: Yup.mixed().required(t("requiredField")),
    room: Yup.mixed().required(t("requiredField")),
  });
  const formik = useFormik({
    initialValues: {
      activityPresetName: "",
      activity: "",
      room: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      let data = {
        id: values.activity.id,
        name: values.activityPresetName,
        activity: values.activity,
        room: values.room,
        actuators: actuatorsProps,
        otherActivities: otherActivities,
        presetId: formikPresets.values.preset.id,
      };
      const response = await BaseRequest({
        method: "POST",
        url: `routines/registerActivyPresetParam`,
        isAuth: true,
        data,
        setIsLoading
      })
      if(response.status == 201){
        toast.success("Parâmetro para atividade preset criada com sucesso.")
      }
      setIsActivityModalOpen(false);
    },
  });



  const validationSchemaActuators = Yup.object().shape({
    actuator: Yup.mixed().required(t("requiredField")),
  });
  const formikActuators = useFormik({
    initialValues: {
      actuator: {},
      status: [],
    },
    validationSchema: validationSchemaActuators,
    onSubmit: async (values) => {
      if (values.status.length < 1) {
        toast.error("Adicione ao menos uma propriedade para o atuador.");
        return;
      }
      if (
        actuatorsProps.some((a) => a.actuator.name === values.actuator.name)
      ) {
        toast.error("Este atuador já foi adicionado.");
        return;
      }
      const isValid = CheckValidProps(values);

      if (isValid.error) {
        toast.error(isValid.error);
        return;
      }
      setActuatorsProps([...actuatorsProps, values]);
      formikActuators.resetForm();
    },
  });

  const validationSchemaOtherActivities = Yup.object().shape({
    otherActivity: Yup.mixed().required(t("requiredField")),
    probability: Yup.number()
      .typeError(t("requiredField"))
      .required(t("requiredField"))
      .min(0, t("minValue", { min: 0 }))
      .max(1, t("maxValue", { max: 1 })),
  });
  const formikOtherActivities = useFormik({
    initialValues: {
      otherActivity: null,
      probability: "",
    },
    validationSchema: validationSchemaOtherActivities,
    onSubmit: async (values) => {
      if (values.otherActivity.id == formik.values.activity.id) {
        toast.error("Atividade já selecionada como principal.");
        return;
      }
      if (
        otherActivities.some(
          (a) => a.otherActivity.id === values.otherActivity.id
        )
      ) {
        toast.error("Esta atividade já foi adicionada.");
        return;
      }

      setOtherActivities([...otherActivities, values]);
      formikOtherActivities.resetForm();
    },
  });

  async function GetActivities() {
    const response = await BaseRequest({
      method: "GET",
      url: `activities/getAllWithoutPage`,
      isAuth: true,
      setIsLoading,
    });
    if (response.status == 200) {
      setEnumActivities(response.data.activitieData);
    }
  }

  useEffect(() => {
    GetActivities();
  }, []);

  useEffect(() => {
    // Every time the field value changes, I reset the actuators
    setActuatorsProps([]);
    formikActuators.resetForm();
  }, [formik.values.room]);
    return (
      <form onSubmit={formikPreferences.handleSubmit} key={index}>
        <h3>{person.peopleName}</h3>
        <Field
          type="number"
          fieldName="priority"
          formik={formikPreferences}
          isLogged={true}
        />
      {formikPresets.values.preset && (
        <div className={s.wrapperInputs}>
          <Field
            type="text"
            fieldName="activityPresetName"
            formik={formik}
            isLogged={true}
            value={formik.values.activityPresetName}
          />
          <div className={s.wrapperActivityColors}>
            <h5>{t("activity")}</h5>
            <DropdownField
              type="text"
              fieldName="activity"
              formik={formik}
              value={formik.values.activity}
              options={enumActivities}
              readOnly={false}
            />
            {formik.values.activity && (
              <p className={s.errorValue}>
                {t("errorValue")}: {formik.values.activity.errorValue}
              </p>
            )}
            {formik.values.activity && (
              <form
                className={s.wrapperAddActuators}
                onSubmit={formikOtherActivities.handleSubmit}>
                {otherActivities.length > 0 &&
                  otherActivities.map((activity) => {
                    return (
                      <div className={s.wrapperEachActuatorSaved}>
                        <Field
                          type="text"
                          fieldName="name"
                          readOnly={true}
                          isLogged={true}
                          value={activity.otherActivity.name}
                        />
                        <Field
                          type="text"
                          fieldName="probability"
                          readOnly={true}
                          isLogged={true}
                          value={activity.probability}
                        />
                      </div>
                    );
                  })}
                <div className={s.otherActivityWrapper}>
                  <DropdownField
                    type="text"
                    fieldName="otherActivity"
                    formik={formikOtherActivities}
                    value={formikOtherActivities.values.activity}
                    options={enumActivities}
                    readOnly={false}
                  />
                  <Field
                    type="number"
                    fieldName="probability"
                    readOnly={false}
                    formik={formikOtherActivities}
                    isLogged={true}
                    value={formikOtherActivities.values.probability}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => formikOtherActivities.handleSubmit()}>
                  {t("addOtherActivity")}
                  <IoMdAdd />
                </button>
              </form>
            )}
          </div>
          <div className={s.wrapperRoomsColor}>
            <h5>{t("room")}</h5>
            <DropdownField
              type="text"
              fieldName="room"
              formik={formik}
              value={formik.values.room}
              options={formikPresets.values.preset.houserooms}
              readOnly={false}
              isMultiSelect={false}
            />
            {formik.values.room && (
              <form
                className={s.wrapperAddActuators}
                onSubmit={formikActuators.handleSubmit}>
                {actuatorsProps.length > 0 &&
                  actuatorsProps.map((actuator) => {
                    return (
                      <div className={s.wrapperEachActuatorSaved}>
                        <Field
                          type="text"
                          fieldName="name"
                          readOnly={true}
                          isLogged={true}
                          value={actuator.actuator.name}
                        />
                        {actuator.status.length > 0 &&
                          actuator.status.map((prop) => {
                            return (
                              <Field
                                type="text"
                                fieldName={prop.name}
                                readOnly={true}
                                isLogged={true}
                                value={prop.value}
                              />
                            );
                          })}
                      </div>
                    );
                  })}
                <DropdownField
                  type="text"
                  fieldName="actuator"
                  formik={formikActuators}
                  value={formikActuators.values.actuator}
                  options={formik.values.room.roomactuators}
                  readOnly={false}
                  hasTranslation={true}
                />
                <RenderActuatorProps formikParam={formikActuators} />
                <button
                  type="button"
                  onClick={() => formikActuators.handleSubmit()}>
                  {t("addActuator")}
                  <IoMdAdd />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
        <button
          type="button"
          onClick={() => formikOtherActivities.handleSubmit()}>
          {t("addPreferences")}
          <IoMdAdd />
        </button>
        <Button
          type="button"
          doFunction={formikPreferences.handleSubmit}
          text={t("saveThisPerson")}
          backgroundColor={"secondary"}
          height={42}
        />
      </form>
    )
  }


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
          <form className={s.wrapperForm} onSubmit={formikPresets.handleSubmit}>
            <DropdownField
              type="text"
              fieldName="preset"
              formik={formikPresets}
              value={formikPresets.values.preset}
              options={presets}
            />
            <section>
              <p>Defina as preferências e prioridades para cada pessoa da rotina.</p>
              <p>Não é necessário definir preferências para todos os cômodos.</p>
              {peopleRoutines.map((person, index) => (
                <PeoplePreferences person={person} index={index}/>
              ))}
            </section>
            <Button
              type="submit"
              text={t("generateFinalFile")}
              backgroundColor={"primary"}
              height={42}
              isLoading={isLoading}
            />
          </form>
        </div>
      </section>
    </main>
  );
}
