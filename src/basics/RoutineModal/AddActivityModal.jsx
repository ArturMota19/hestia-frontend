// Components
import Button from "../Button/Button";
import DropdownField from "../DropdownField/DropdownField";
import { useTranslation } from "react-i18next";
// Images

// Imports

import * as Yup from "yup";
import { useFormik } from "formik";
// Styles
import s from "./RoutineModal.module.scss";
import { useEffect, useState } from "react";
import { BaseRequest } from "../../services/BaseRequest";

export default function AddActivityModal({
  isActivityModalOpen,
  setIsActivityModalOpen,
  items,
  setItems,
  preset,
}) {
  if (!isActivityModalOpen) return null;
  const [enumActivities, setEnumActivities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);
  const { t } = useTranslation();
  const validationSchema = Yup.object().shape({
    activity: Yup.mixed().required(t("requiredField")),
  });
  const formik = useFormik({
    initialValues: {
      activity: "",
      room: "",
      associatedActivities: "",
      actuators: "",
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
    console.log(preset)
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
        {formik.values.activity && <p className={s.errorValue}>{t('errorValue')}: {formik.values.activity.errorValue}</p>}
        <DropdownField
          type="text"
          fieldName="room"
          formik={formik}
          value={formik.values.room}
          options={preset.houserooms}
          readOnly={false}
          isMultiSelect={false}
        />
        {formik.values.room &&
          <DropdownField
            type="text"
            fieldName="actuators"
            formik={formik}
            value={formik.values.actuators}
            options={formik.values.room.roomactuators}
            readOnly={false}
            isMultiSelect={true}
          />
        }
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
