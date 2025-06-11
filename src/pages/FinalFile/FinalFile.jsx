// Components
import Header from "../../basics/Header/Header";
import DropdownField from "../../basics/DropdownField/DropdownField";
import Button from "../../basics/Button/Button";
import RenderActuatorProps from "../../basics/RoutineModal/RenderActuatorProps";
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
  const [peopleRoutines, setPeopleRoutines] = useState([]);
  const [preferenceData, setPreferenceData] = useState([]);

  const { t } = useTranslation();

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
    if (peopleRoutines.length - preferenceData.length != 0) {
      toast.error("Salve todas as preferências para continuar.");
      return;
    }
    setIsLoading(true);
    try {
      if (!responseData) {
        toast.error("Houve um problema ao tratar os dados iniciais.");
        return;
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
          ocupacao_maxima: 10,
        },
      };

      const sourceRooms = responseData.find((item) => item.rooms)?.rooms || [];
      sourceRooms.forEach((roomEntry) => {
        const originalRoomName = roomEntry.room.name;
        const roomKey = originalRoomName.toLowerCase().replace(/\s+/g, "_");
        const formattedRoomName = originalRoomName
          .toUpperCase()
          .replace(/\s+/g, "_");
        COMODOS[roomKey] = {
          nome: formattedRoomName,
          atuadores: roomEntry.roomactuators.map((ra) =>
            ra.actuator.name.toUpperCase()
          ),
          ocupacao_maxima: roomEntry.room.capacity,
        };
      });

      // 3. GRAFO_COMODOS
      const GRAFO_COMODOS = [];
      const firstRealRoomKey = Object.keys(COMODOS).find(
        (key) => key !== "rua"
      );
      if (firstRealRoomKey) {
        GRAFO_COMODOS.push(["RUA", COMODOS[firstRealRoomKey].nome, 5]);
      }
      const sourceGraph = responseData.find((item) => item.graph)?.graph || [];
      sourceGraph.forEach((connection) => {
        const originName = connection.originHouseRoom.room.name
          .toUpperCase()
          .replace(/\s+/g, "_");
        const destinationName = connection.destinationHouseRoom.room.name
          .toUpperCase()
          .replace(/\s+/g, "_");
        GRAFO_COMODOS.push([originName, destinationName, connection.distance]);
      });

      // 4. ATIVIDADES
      const ATIVIDADES = {};
      const scheduledActivities =
        responseData.find((item) => item.activities)?.activities || [];
      const calcularDuracaoEmMinutos = (startTime, endTime) => {
        const [sH, sM, sS] = startTime.split(":").map(Number);
        const [eH, eM, eS] = endTime.split(":").map(Number);
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
        const activityBaseName = assoc.activity.name
          .toUpperCase()
          .replace(/\s+/g, "_");
        const roomOriginalName = assoc.houserooms.room.name;
        const roomFormattedName = roomOriginalName
          .toUpperCase()
          .replace(/\s+/g, "_");
        const duration = calcularDuracaoEmMinutos(
          scheduledActivity.startTime,
          scheduledActivity.endTime
        );
        const activityKey = `${activityBaseName}_${roomFormattedName}_${duration}MIN${index}`;

        // Monta lista_atuadores_atividade
        const atuadoresAtividade = {};
        assoc.actuatorsActivity.forEach((actuatorDetail) => {
          const actuatorName = actuatorDetail.actuator.name.toUpperCase();
          let estado = "OFF";
          if (
            actuatorDetail.hasOwnProperty("switch_1") &&
            actuatorDetail.switch_1 === "ON"
          )
            estado = "ON";
          else if (
            actuatorDetail.hasOwnProperty("switch") &&
            actuatorDetail.switch === "ON"
          )
            estado = "ON";
          else if (
            actuatorDetail.hasOwnProperty("switch_led") &&
            actuatorDetail.switch_led === "ON"
          )
            estado = "ON";
          // 50% chance de ser "P" ou "D"
          const comportamento = Math.random() < 0.5 ? "P" : "D";
          atuadoresAtividade[actuatorName] = [estado, comportamento];
        });

        // Monta atividades_associadas
        const atividadesAssociadas = {};
        if (assoc.otherActivities && Array.isArray(assoc.otherActivities)) {
          assoc.otherActivities.forEach((otherAct) => {
            const otherActName = otherAct.activity.name
              .toUpperCase()
              .replace(/\s+/g, "_");
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
                lista_atuadores_atividade: {},
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
          lista_atuadores_atividade: atuadoresAtividade,
        };
      });

      // 5. USUARIOS
      const USUARIOS = {};
      const sourceDays = responseData.find((item) => item.days)?.days || [];

      preferenceData.forEach((preferenceEntry) => {
        const personName = Object.keys(preferenceEntry)[0];
        const personData = preferenceEntry[personName];

        const userKey = personName.toLowerCase().replace(/\s+/g, "_");

        const personRoutine = sourceDays.find(
          (routine) =>
            routine.person &&
            routine.person.person &&
            routine.person.person.name === personName
        );

        const rotina_semana = [];

        if (personRoutine && personRoutine.days) {
          const daysOrder = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ];

          daysOrder.forEach((day) => {
            if (
              personRoutine.days[day] &&
              Array.isArray(personRoutine.days[day])
            ) {
              const dayActivities = [];

              personRoutine.days[day].forEach((activity) => {
                const activityAssoc = activity.activityPresetParamAssociation;
                if (activityAssoc) {
                  const duration = calcularDuracaoEmMinutos(
                    activity.startTime,
                    activity.endTime
                  );
                  const activityBaseName = activityAssoc.activity.name
                    .toUpperCase()
                    .replace(/\s+/g, "_");
                  const roomFormattedName = activityAssoc.houserooms.room.name
                    .toUpperCase()
                    .replace(/\s+/g, "_");

                  const matchingActivityKey = Object.keys(ATIVIDADES).find(
                    (key) => {
                      const activityData = ATIVIDADES[key];
                      return (
                        activityData.duracao === duration &&
                        activityData.local_atividade === roomFormattedName &&
                        key.includes(activityBaseName)
                      );
                    }
                  );

                  if (matchingActivityKey) {
                    dayActivities.push(matchingActivityKey);
                  }
                }
              });

              rotina_semana.push(dayActivities);
            } else {
              rotina_semana.push([]);
            }
          });
        } else {
          for (let i = 0; i < 7; i++) {
            rotina_semana.push([]);
          }
        }

        USUARIOS[userKey] = {
          nome: personData.nome,
          prioridade: personData.prioridade,
          comodo_atual: personData.comodo_atual,
          preferencia: personData.preferencia,
          rotina_semana: rotina_semana,
        };
      });

      const usersWithEmptyDays = Object.entries(USUARIOS).filter(
        ([, user]) =>
          Array.isArray(user.rotina_semana) &&
          user.rotina_semana.some((day) => !day || day.length === 0)
      );
      if (usersWithEmptyDays.length > 0) {
        toast.error(
          "Existe(m) usuário(s) com dias sem atividades na rotina. Verifique antes de gerar o arquivo."
        );
        setIsLoading(false);
        return;
      }
      // 6. AUTOMACAO
      const AUTOMACAO = [];

      // 7. Retorno final
      const finalData = {
        ATUADORES,
        COMODOS,
        GRAFO_COMODOS,
        ATIVIDADES,
        USUARIOS,
        AUTOMACAO,
      };

      const blob = new Blob([JSON.stringify(finalData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      let id = Date.now()
      const presetNameWithUnderscores = formikPresets.values.preset.name.replace(/\s+/g, "_");
      a.download = `${presetNameWithUnderscores}${id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e);
    } finally {
      setIsLoading(false);
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

  async function GetCreatedRoutines() {
    if (formikPresets.values.preset == "") {
      return;
    }
    const response = await BaseRequest({
      method: "GET",
      url: `routines/getPeopleRoutinesByPresetId/${formikPresets.values.preset.id}`,
      isAuth: true,
      setIsLoading,
    });
    if (response.status == 200) {
      setPeopleRoutines(response.data);
    }
  }

  useEffect(() => {
    if (formikPresets.values.preset != "") {
      GetCreatedRoutines();
    }
  }, [formikPresets.values.preset]);

  const PeoplePreferences = ({ person, index }) => {
    const [actuatorsProps, setActuatorsProps] = useState([]);
    const validationSchemaPreferences = Yup.object().shape({
      priority: Yup.number().min(1, "Min 1").required(t("requiredField")),
    });
    const formikPreferences = useFormik({
      initialValues: {
        priority: "",
      },
      validationSchema: validationSchemaPreferences,
      onSubmit: async (values) => {
        let finalData = {
          [person["peopleName"]]: {
            nome: person.peopleName,
            prioridade: values.priority,
            comodo_atual: "RUA",
            preferencia: {},
          },
        };
        actuatorsProps.forEach((item) => {
          const comodo = item.room.name.toLowerCase().replace(/\s+/g, "_");
          const atuador = item.actuator.name.toUpperCase();

          if (!finalData[person.peopleName].preferencia[comodo]) {
            finalData[person.peopleName].preferencia[comodo] = {};
          }

          if (!finalData[person.peopleName].preferencia[comodo][atuador]) {
            finalData[person.peopleName].preferencia[comodo][atuador] = {};
          }
          item.status.forEach((statusItem) => {
            finalData[person.peopleName].preferencia[comodo][atuador][
              statusItem.name
            ] = statusItem.value;
          });
        });
        setPreferenceData([...preferenceData, finalData]);
      },
    });

    const validationSchema = Yup.object().shape({
      room: Yup.mixed().required(t("requiredField")),
    });
    const formik = useFormik({
      initialValues: {
        room: "",
      },
      validationSchema,
      onSubmit: async (values) => {},
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
          actuatorsProps.some(
            (a) =>
              a.actuator.name === values.actuator.name &&
              a.room.id === formik.values.room.id
          )
        ) {
          toast.error("Este atuador já foi adicionado.");
          return;
        }
        const isValid = CheckValidProps(values);

        if (isValid.error) {
          toast.error(isValid.error);
          return;
        }
        let data = {
          actuator: values.actuator,
          status: values.status,
          room: formik.values.room,
        };
        setActuatorsProps([...actuatorsProps, data]);
        formikActuators.resetForm();
      },
    });

    return (
      <form
        onSubmit={formikPreferences.handleSubmit}
        className={s.formWrapperIntern}
        key={index}>
        <h3>{person.peopleName}</h3>
        <Field
          type="number"
          fieldName="priority"
          formik={formikPreferences}
          isLogged={true}
        />
        {formikPresets.values.preset && (
          <div className={s.wrapperInputs}>
            {actuatorsProps.length > 0 && (
              <div className={s.wrapperEachActuatorSaved}>
                <h5>{t("savedPreferences")}</h5>
                {actuatorsProps.map((actuator, index) => (
                  <section
                    className={s.internEachActuator}
                    key={`${actuator.actuator.name}${index}`}>
                    <Field
                      type="text"
                      fieldName="room"
                      readOnly={true}
                      isLogged={true}
                      value={actuator.room.name}
                    />
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
                  </section>
                ))}
              </div>
            )}
            <div className={s.wrapperRoomsColor}>
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
                </form>
              )}
            </div>
          </div>
        )}
        <button
          type="button"
          className={s.addActuatorButton}
          onClick={() => formikActuators.handleSubmit()}>
          {t("addActuator")}
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
    );
  };

  function CheckPersonArray(person) {
    return !preferenceData.some((entry) => {
      const key = Object.keys(entry)[0];
      return key === person;
    });
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
            <section className={s.formPreferencesWrapper}>
              {peopleRoutines.length > 0 && (
                <>
                  <p className={s.textPreferences}>
                    {t("definePreferences")}
                    <br />
                    {t("preferencesAdvice")}
                  </p>
                  {peopleRoutines.length - preferenceData.length ===
                  0 ? null : (
                    <h6 className={s.savePersonGenerate}>
                      {t("savePerson")}{" "}
                      {peopleRoutines.length - preferenceData.length} {t("personGenerateFile")}
                    </h6>
                  )}
                </>
              )}
              {peopleRoutines.map(
                (person, index) =>
                  CheckPersonArray(person.peopleName) && (
                    <PeoplePreferences
                      person={person}
                      index={index}
                      key={index}
                    />
                  )
              )}
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
