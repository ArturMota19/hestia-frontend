import React, { useEffect, useCallback } from 'react';
import { useFormikContext } from 'formik';
import s from "./RoutineModal.module.scss";


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

const RangeInput = React.memo(({ name, value, min, max, onChange }) => (
  <div className={s.inputWrapper}>
    <label>
      {name}:{" "}
      <input
        type="number"
        name={name}
        className={s.field}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
    </label>
  </div>
));

const BooleanInput = React.memo(({ name, checked, onChange }) => (
  <div className={s.inputWrapper}>
    <label>
      {name}:{" "}
      <input
        type="checkbox"
        className={s.checkBox}
        name={name}
        checked={checked}
        onChange={onChange}
      />
    </label>
  </div>
));

const EnumInput = React.memo(({ name, value, options, onChange }) => (
  <div className={s.inputWrapper}>
    <label>
      {name}:{" "}
      <select
        name={name}
        className={s.field}
        value={value}
        onChange={onChange}
      >
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  </div>
));

const RenderActuatorProps = ({formikParam}) => {
  const type = formikParam.values.actuator.name;
  const props = actuatorStatusMap[type];

  useEffect(() => {
    if (!props) return;
    
    const currentStatus = formikParam.values.status || [];
    if (
      currentStatus.length !== props.length ||
      currentStatus.some((s, i) => s?.name !== props[i].name)
    ) {
      const initialStatus = props.map((prop) => ({
        name: prop.name,
        value: getDefaultValue(prop),
      }));
      formikParam.setFieldValue("status", initialStatus);
    }
  }, [props, formikParam]);

  const getDefaultValue = (prop) => {
    if (prop.type === "boolean") return false;
    if (prop.type === "range") return prop.min ?? 0;
    if (prop.type === "enum") return prop.options?.[0] ?? "";
    return "";
  };

  const handleChange = useCallback((idx, propType) => (e) => {
    let value;
    if (propType === "boolean") {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }
    formikParam.setFieldValue(`status[${idx}].value`, value);
  }, [formikParam.setFieldValue]);

  if (!props) return null;

  return (
    <div className={s.wrapperProps}>
      {props.map((prop, idx) => {
        const fieldValue = formikParam.values.status[idx]?.value ?? getDefaultValue(prop);

        switch (prop.type) {
          case "boolean":
            return (
              <BooleanInput
                key={prop.name}
                name={prop.name}
                checked={fieldValue}
                onChange={handleChange(idx, "boolean")}
              />
            );
          case "range":
            return (
              <RangeInput
                key={prop.name}
                name={prop.name}
                value={fieldValue}
                min={prop.min}
                max={prop.max}
                onChange={handleChange(idx, "range")}
              />
            );
          case "enum":
            return (
              <EnumInput
                key={prop.name}
                name={prop.name}
                value={fieldValue}
                options={prop.options}
                onChange={handleChange(idx, "enum")}
              />
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

export default React.memo(RenderActuatorProps);