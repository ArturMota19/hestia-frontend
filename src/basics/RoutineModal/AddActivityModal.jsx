// Components
import Button from "../Button/Button";
import DropdownField from "../DropdownField/DropdownField";
import { useTranslation } from "react-i18next";
// Images
import { IoMdAdd } from "react-icons/io";
// Imports

import * as Yup from "yup";
import { useFormik } from "formik";
// Styles
import s from "./RoutineModal.module.scss";
import { useEffect, useState } from "react";
import { BaseRequest } from "../../services/BaseRequest";
import toast from "react-hot-toast";

export default function AddActivityModal({
  isActivityModalOpen,
  setIsActivityModalOpen,
  items,
  setItems,
  preset,
}) {
  if (!isActivityModalOpen) return null;
  const [enumActivities, setEnumActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actuatorsProps, setActuatorsProps] = useState([]);
  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);
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

/*
LAMPADA: switch_led (ON/OFF), bright_value_v2 (0–1000), temp_value_v2 (0–1000)
CAFETEIRA: switch (ON/OFF)
PLUG: switch_1 (ON/OFF)
SOM: switch (ON/OFF), sound_volume (0–100)
AR_CONDICIONADO: switch (ON/OFF), temp_set (16–30), mode (COLL/HOT/WET/WIND/AUTO)
TV: switch (ON/OFF), sound_volume (0–100)
SENSOR_PRESENCA: presence_state (ON/OFF), human_motion_state (NONE/SMALL_MOVE/LARGER_MOVE)
*/

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

    if (expectedProp.type === "boolean") {
      if (typeof prop.value !== "boolean") {
        return { error: `invalidType: ${prop.name} should be boolean` };
      }
    } else if (expectedProp.type === "range") {
      if (typeof prop.value !== "number" || prop.value < expectedProp.min || prop.value > expectedProp.max) {
        return { error: `outOfRange: ${prop.name} should be between ${expectedProp.min} and ${expectedProp.max}` };
      }
    } else if (expectedProp.type === "enum") {
      if (!expectedProp.options.includes(prop.value)) {
        return { error: `invalidOption: ${prop.name} should be one of ${expectedProp.options.join(", ")}` };
      }
    } else {
      return { error: `unknownType: ${expectedProp.type}` };
    }
  }

  return { valid: true };
}


const RenderActuatorProps = ({ formikParam }) => {
  let type = formikParam.values.actuator.name;
  const props = actuatorStatusMap[type];

  useEffect(() => {
    if (!props) return;
    if (
      !formikParam.values.status ||
      formikParam.values.status.length !== props.length ||
      formikParam.values.status.some((s, i) => s?.name !== props[i].name)
    ) {
      const initialStatus = props.map((prop) => {
        let value = "";
        if (prop.type === "boolean") value = false;
        else if (prop.type === "range") value = prop.min ?? 0;
        else if (prop.type === "enum") value = prop.options?.[0] ?? "";
        return { name: prop.name, value };
      });
      formikParam.setFieldValue("status", initialStatus);
    }
    // eslint-disable-next-line
  }, [type]);

  if (!props) return <p>Tipo desconhecido: {type}</p>;

  return (
    <div>
      {props.map((prop, idx) => {
        const handleChange = (e) => {
          let value;
          if (prop.type === "boolean") {
            value = e.target.checked;
          } else if (prop.type === "range" || prop.type === "enum") {
            value = e.target.value;
          }
          const newStatus = [...formikParam.values.status];
          newStatus[idx] = { name: prop.name, value };
          formikParam.setFieldValue("status", newStatus);
        };

        switch (prop.type) {
          case "boolean":
            return (
              <div key={prop.name}>
                <label>
                  {prop.name}:{" "}
                  <input
                    type="checkbox"
                    name={prop.name}
                    checked={
                      formikParam.values.status[idx]?.value || false
                    }
                    onChange={handleChange}
                  />
                </label>
              </div>
            );
          case "range":
            return (
              <div key={prop.name}>
                <label>
                  {prop.name}:{" "}
                  <input
                    type="number"
                    name={prop.name}
                    min={prop.min}
                    max={prop.max}
                    value={
                      formikParam.values.status[idx]?.value ?? prop.min ?? 0
                    }
                    onChange={handleChange}
                  />
                </label>
              </div>
            );
          case "enum":
            return (
              <div key={prop.name}>
                <label>
                  {prop.name}:{" "}
                  <select
                    name={prop.name}
                    value={
                      formikParam.values.status[idx]?.value || ""
                    }
                    onChange={handleChange}
                  >
                    <option value="">Selecione</option>
                    {prop.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            );
          default:
            return (
              <div key={prop.name}>
                <p>Tipo não suportado: {prop.type}</p>
              </div>
            );
        }
      })}
    </div>
  );
};


  const validationSchema = Yup.object().shape({
    activity: Yup.mixed().required(t("requiredField")),
  });
  const formik = useFormik({
    initialValues: {
      activity: "",
      room: "",
      associatedActivities: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      setItems((prevItems) => [
        ...prevItems,
        {
          id: prevItems.length + 1,
          title: values.activity,
          start: totalDuration,
          duration: 1,
        },
      ]);
      console.log(items, values);
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
      console.log(values)
      if(values.status.length < 1){
        toast.error("Adicione ao menos uma propriedade para o atuador.")
        return
      }
      if (actuatorsProps.some(a => a.actuator.name === values.actuator.name)) {
        toast.error("Este atuador já foi adicionado.");
        return;
      }
      const isValid = CheckValidProps(values)

      if(isValid.error){
        toast.error(isValid.error)
        return
      }
      setActuatorsProps([...actuatorsProps, values])
      formikActuators.resetForm()
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
    console.log(preset);
  }, []);

  return (
    <form className={s.activityForm} onSubmit={formik.handleSubmit}>
      <h4>{t("addActivity")}</h4>
      <div className={s.wrapperInputs}>
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
        <DropdownField
          type="text"
          fieldName="room"
          formik={formik}
          value={formik.values.room}
          options={preset.houserooms}
          readOnly={false}
          isMultiSelect={false}
        />
        {formik.values.room && (
          <form className={s.wrapperAddActuators} onSubmit={formikActuators.handleSubmit}>
            <DropdownField
              type="text"
              fieldName="actuator"
              formik={formikActuators}
              value={formikActuators.values.actuator}
              options={formik.values.room.roomactuators}
              readOnly={false}
            />
            <RenderActuatorProps 
              formikParam={formikActuators} 
            />
            <button
              type="button"
              onClick={() => formikActuators.handleSubmit()}>
              {t("addActuator")}
              <IoMdAdd />
            </button>
          </form>
        )}
      </div>
      <div className={s.arrayButtons}>
        <Button
          type="button"
          text={t("cancel")}
          backgroundColor={"secondary"}
          height={42}
          doFunction={() => {
            setIsActivityModalOpen(false);
          }}
        />
        <Button
          type="button"
          text={t("save")}
          backgroundColor={"primary"}
          height={42}
        />
      </div>
    </form>
  );
}
