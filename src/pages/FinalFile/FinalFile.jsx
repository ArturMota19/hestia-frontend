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
  const [presets, setPresets] = useState([]);
  const { t } = useTranslation();

  function transformToSimulator(responseData) {
    // 1. ATUADORES
    const ATUADORES = [
      "LAMPADA",
      "CAFETEIRA",
      "PLUG",
      "SOM",
      "AR_CONDICIONADO",
      "TV",
      "SENSOR_PRESENCA"
    ];

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
    scheduledActivities.forEach(scheduledActivity => {
      const index = scheduledActivities.indexOf(scheduledActivity);
      const assoc = scheduledActivity.activityPresetParamAssociation;
      const activityBaseName = assoc.activity.name.toUpperCase().replace(/\s+/g, '_');
      const roomOriginalName = assoc.houserooms.room.name;
      const roomFormattedName = roomOriginalName.toUpperCase().replace(/\s+/g, '_');
      const duration = calcularDuracaoEmMinutos(scheduledActivity.startTime, scheduledActivity.endTime);
      const activityKey = `${activityBaseName}_${roomFormattedName}_${duration}MIN${index}`;
      if (!ATIVIDADES[activityKey]) {
      const atuadoresAtividade = {};
      assoc.actuatorsActivity.forEach(actuatorDetail => {
        const actuatorName = actuatorDetail.actuator.name.toUpperCase();
        let estado = "OFF";
        if (actuatorDetail.hasOwnProperty('switch_1') && actuatorDetail.switch_1 === "ON") estado = "ON";
        else if (actuatorDetail.hasOwnProperty('switch') && actuatorDetail.switch === "ON") estado = "ON";
        else if (actuatorDetail.hasOwnProperty('switch_led') && actuatorDetail.switch_led === "ON") estado = "ON";
        atuadoresAtividade[actuatorName] = [estado, "P"];
      });
      // Preenche os detalhes do atuador conforme os campos disponíveis
      ATIVIDADES[activityKey] = {
        nome: activityKey,
        inicio_ocorrencia: null,
        fim_ocorrencia: null,
        duracao: duration,
        taxa_erro: assoc.activity.errorValue,
        local_atividade: roomFormattedName,
        atividades_associadas: {},
        lista_atuadores_atividade: {}
      };

      assoc.actuatorsActivity.forEach(actuatorDetail => {
        const actuatorName = actuatorDetail.actuator.name.toUpperCase();
        const actuatorData = {};

        if (actuatorDetail.hasOwnProperty('switch') && actuatorDetail.switch !== null)
        actuatorData.switch = actuatorDetail.switch;
        if (actuatorDetail.hasOwnProperty('switch_1') && actuatorDetail.switch_1 !== null)
        actuatorData.switch_1 = actuatorDetail.switch_1;
        if (actuatorDetail.hasOwnProperty('switch_led') && actuatorDetail.switch_led !== null)
        actuatorData.switch_led = actuatorDetail.switch_led;
        if (actuatorDetail.hasOwnProperty('bright_value_v2') && actuatorDetail.bright_value_v2 !== null)
        actuatorData.bright_value_v2 = actuatorDetail.bright_value_v2;
        if (actuatorDetail.hasOwnProperty('temp_value_v2') && actuatorDetail.temp_value_v2 !== null)
        actuatorData.temp_value_v2 = actuatorDetail.temp_value_v2;
        if (actuatorDetail.hasOwnProperty('sound_volume') && actuatorDetail.sound_volume !== null)
        actuatorData.sound_volume = actuatorDetail.sound_volume;
        if (actuatorDetail.hasOwnProperty('temp_set') && actuatorDetail.temp_set !== null)
        actuatorData.temp_set = actuatorDetail.temp_set;
        if (actuatorDetail.hasOwnProperty('mode') && actuatorDetail.mode !== null)
        actuatorData.mode = actuatorDetail.mode;
        if (actuatorDetail.hasOwnProperty('presence_state') && actuatorDetail.presence_state !== null)
        actuatorData.presence_state = actuatorDetail.presence_state;
        if (actuatorDetail.hasOwnProperty('human_motion_state') && actuatorDetail.human_motion_state !== null)
        actuatorData.human_motion_state = actuatorDetail.human_motion_state;

        ATIVIDADES[activityKey].lista_atuadores_atividade[actuatorName] = actuatorData;
      });
      }

      if (assoc.otherActivities && Array.isArray(assoc.otherActivities)) {
      assoc.otherActivities.forEach(otherAct => {
        const otherActName = otherAct.activity.name.toUpperCase().replace(/\s+/g, '_');
        if (!ATIVIDADES[otherActName]) {
        ATIVIDADES[otherActName] = {
          nome: otherActName,
          inicio_ocorrencia: null,
          fim_ocorrencia: null,
          duracao: Math.floor(Math.random() * 41) + 10,
          taxa_erro: 0.1,
          local_atividade: null,
          atividades_associadas: {},
          lista_atuadores_atividade: {}
        };
        }
        ATIVIDADES[activityKey].atividades_associadas[otherActName] = otherAct.probability;
      });
      }
    });

    // 5. USUARIOS
    // const USUARIOS = {};
    // const sourceDaysInfo = (responseData.find(item => item.days)?.days) || [];
    // sourceDaysInfo.forEach(personEntry => {
    //   const personDetails = personEntry.person;
    //   const userKey = personDetails.person.name.toLowerCase().replace(/\s+/g, '_');
    //   // Preferencias
    //   const preferencias = {};
    //   Object.keys(COMODOS).forEach(roomKey => {
    //     if (roomKey === 'rua') return;
    //     const comodoDef = COMODOS[roomKey];
    //     preferencias[comodoDef.nome] = {};
    //     comodoDef.atuadores.forEach(actuatorName => {
    //       const actuatorPrefs = {};
    //       switch (actuatorName.toUpperCase()) {
    //         case "LAMPADA":
    //           actuatorPrefs.switch_led = "ON";
    //           actuatorPrefs.bright_value_v2 = 600;
    //           actuatorPrefs.temp_value_v2 = 300;
    //           break;
    //         case "CAFETEIRA":
    //           actuatorPrefs.switch = "OFF";
    //           break;
    //         case "PLUG":
    //           actuatorPrefs.switch_1 = "OFF";
    //           break;
    //         case "SOM":
    //           actuatorPrefs.switch = "OFF";
    //           actuatorPrefs.sound_volume = 20;
    //           break;
    //         case "AR_CONDICIONADO":
    //           actuatorPrefs.switch = "OFF";
    //           actuatorPrefs.temp_set = 23;
    //           actuatorPrefs.mode = "AUTO";
    //           break;
    //         case "TV":
    //           actuatorPrefs.switch = "OFF";
    //           actuatorPrefs.sound_volume = 15;
    //           break;
    //         // SENSOR_PRESENCA não costuma ter preferências de estado setáveis
    //       }
    //       if (Object.keys(actuatorPrefs).length > 0) {
    //         preferencias[comodoDef.nome][actuatorName.toUpperCase()] = actuatorPrefs;
    //       }
    //     });
    //   });
      // Rotina semanal
      // const rotinaSemanal = [[], [], [], [], [], [], []];
      // const diasDaSemanaResponse = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      // diasDaSemanaResponse.forEach((diaNome, index) => {
      //   const atividadesDoDiaNaResponse = personEntry.days[diaNome];
      //   if (atividadesDoDiaNaResponse && atividadesDoDiaNaResponse.length > 0) {
      //     let tempoTotalDia = 0;
      //     atividadesDoDiaNaResponse.forEach(scheduledActivity => {
      //       const assoc = scheduledActivity.activityPresetParamAssociation;
      //       const activityBaseName = assoc.activity.name.toUpperCase().replace(/\s+/g, '_');
      //       const roomOriginalName = assoc.houserooms.room.name;
      //       const roomFormattedName = roomOriginalName.toUpperCase().replace(/\s+/g, '_');
      //       const duration = calcularDuracaoEmMinutos(scheduledActivity.startTime, scheduledActivity.endTime);
      //       const activityKey = `${activityBaseName}_${roomFormattedName}_${duration}MIN`;
      //       if (ATIVIDADES[activityKey]) {
      //         rotinaSemanal[index].push(activityKey);
      //         tempoTotalDia += duration;
      //       } else {
      //         // Cria atividade se não existir
      //         const atuadoresAtividade = {};
      //         assoc.actuatorsActivity.forEach(actuatorDetail => {
      //           const actuatorName = actuatorDetail.actuator.name.toUpperCase();
      //           let estado = (actuatorDetail.switch_1 === "ON" || actuatorDetail.switch === "ON" || actuatorDetail.switch_led === "ON") ? "ON" : "OFF";
      //           atuadoresAtividade[actuatorName] = [estado, "P"];
      //         });
      //         ATIVIDADES[activityKey] = {
      //           nome: activityKey,
      //           duracao: duration,
      //           taxa_erro: assoc.activity.errorValue,
      //           local_atividade: roomFormattedName,
      //           atividades_associadas: {},
      //           lista_atuadores_atividade: atuadoresAtividade
      //         };
      //         rotinaSemanal[index].push(activityKey);
      //         tempoTotalDia += duration;
      //       }
      //     });
      //     // Preenche até 1440 min
      //     if (tempoTotalDia < 1440) {
      //       const diferenca = 1440 - tempoTotalDia;
      //       const nomeAtividadePreenchimento = `TEMPO_LIVRE_PADRAO_${diferenca}MIN`;
      //       if (!ATIVIDADES[nomeAtividadePreenchimento]) {
      //         ATIVIDADES[nomeAtividadePreenchimento] = {
      //           nome: nomeAtividadePreenchimento,
      //           duracao: diferenca,
      //           taxa_erro: 0,
      //           local_atividade: firstRealRoomKey ? COMODOS[firstRealRoomKey].nome : "RUA",
      //           atividades_associadas: {},
      //           lista_atuadores_atividade: {}
      //         };
      //       }
      //       rotinaSemanal[index].push(nomeAtividadePreenchimento);
      //     }
      //   } else {
      //     // Se não há atividades, preenche com TEMPO_LIVRE
      //     const nomeAtividadeLivre = `TEMPO_LIVRE_PADRAO_1440MIN`;
      //     if (!ATIVIDADES[nomeAtividadeLivre]) {
      //       ATIVIDADES[nomeAtividadeLivre] = {
      //         nome: nomeAtividadeLivre,
      //         duracao: 1440,
      //         taxa_erro: 0,
      //         local_atividade: firstRealRoomKey ? COMODOS[firstRealRoomKey].nome : "RUA",
      //         atividades_associadas: {},
      //         lista_atuadores_atividade: {}
      //       };
      //     }
      //     rotinaSemanal[index].push(nomeAtividadeLivre);
      //   }
      // });
      // USUARIOS[userKey] = {
      //   nome: personDetails.person.name,
      //   prioridade: 1,
      //   comodo_atual: "RUA",
      //   preferencia: preferencias,
      //   rotina_semana: rotinaSemanal
      // };
    // });

    // 6. AUTOMACAO
    const AUTOMACAO = [];

    // 7. Retorno final
    // Monta o objeto final
    const finalData = {
      ATUADORES,
      COMODOS,
      GRAFO_COMODOS,
      ATIVIDADES,
      // USUARIOS,
      AUTOMACAO
    };

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
      console.log(values);
      const response = await BaseRequest({
        method: "GET",
        url: `/final-file/generateFinalFile/${values.preset.id}`,
        setIsLoading,
        isAuth: true,
      })
      if(response.status == 200){
        transformToSimulator(response.data.finalData)
      }
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
          <form className={s.wrapperForm} onSubmit={formikPresets.handleSubmit}>
            <DropdownField
              type="text"
              fieldName="preset"
              formik={formikPresets}
              value={formikPresets.values.preset}
              options={presets}
            />
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
