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
  const [isLoading, setIsLoading] = useState(false);
  const [presets, setPresets] = useState([]);
  const { t } = useTranslation();

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
      // Monta o objeto final
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
