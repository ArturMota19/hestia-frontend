// Components
import Button from "../Button/Button";
import DropdownField from "../DropdownField/DropdownField";
import { useTranslation } from "react-i18next";
import RenderActuatorProps from "./RenderActuatorProps";
// Images
import { IoMdAdd } from "react-icons/io";
// Imports

import * as Yup from "yup";
import { useFormik } from "formik";
import Field from "../Field/Field";
// Styles
import s from "./RoutineModal.module.scss";
import { useEffect, useState } from "react";
import { BaseRequest } from "../../services/BaseRequest";
import toast from "react-hot-toast";

export default function AddActivityModal({
    isActivityModalOpen,
    setIsActivityModalOpen,
    FetchData,
    isEditing=false,
    dataIsEditing=false
}) {
    if (!isActivityModalOpen) return null;
    const [enumActivities, setEnumActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [actuatorsProps, setActuatorsProps] = useState([]);
    const [otherActivities, setOtherActivities] = useState([]);
    const [presets, setPresets] = useState([]);
    const [isProgrammaticallySettingRoom, setIsProgrammaticallySettingRoom] = useState(false);
    const { t } = useTranslation();


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
        },
    });

    function CheckValidProps(values) {
        const actuatorName = values.actuator.name;
        const statusProps = values.status;
        const expectedProps = actuatorStatusMap[actuatorName];

        if (!expectedProps) {
            return { error: "unknownActuator" };
        }

        for (const prop of statusProps) {
            const expectedProp = expectedProps.find(
                (p) => p.name === prop.name
            );

            if (!expectedProp) {
                return { error: `unknownProp: ${prop.name}` };
            }

            const inputIntValue = parseInt(prop.value);

            if (expectedProp.type === "boolean") {
                if (typeof prop.value !== "boolean") {
                    return {
                        error: `invalidType: ${prop.name} should be boolean`,
                    };
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
                url: `activitiesPresetParamRoutes/register`,
                isAuth: true,
                data,
                setIsLoading,
            });
            if (response.status == 201) {
                toast.success(
                    "Parâmetro para atividade preset criada com sucesso."
                );
                FetchData()
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
                toast.error(
                    "Adicione ao menos uma propriedade para o atuador."
                );
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
        if (!isProgrammaticallySettingRoom) {
            setActuatorsProps([]);
            formikActuators.resetForm();
        }
    }, [formik.values.room]);

    async function GetById(){
        setIsProgrammaticallySettingRoom(true);
        const response = await BaseRequest({
            method: "GET",
            url: `activitiesPresetParamRoutes/getById/${dataIsEditing}`,
            isAuth: true,
            setIsLoading,
        });
        if (response.status == 200) {
            setIsLoading(true)
            const preset = presets.find(p => p.id === response.data.presetId);
            formikPresets.setFieldValue("preset", preset || "");
            formik.setFieldValue("activityPresetName", response.data.name || "");

            formik.setFieldValue("activity", response.data.activity || "");
            const room = preset.houserooms.find(r => r.id === response.data.activityRoomId)
            formik.setFieldValue("room", room || "");

            setActuatorsProps(
                (response.data.actuators || []).map(actuator => ({
                    actuator: actuator.actuator,
                    status: actuator.status || []
                }))
            );
            setOtherActivities(response.data.otherActivities || []);
        }
            setTimeout(() => {
                setIsProgrammaticallySettingRoom(false); 
            }, 500);
    }

    useEffect(() => {
        if(!isEditing || presets.length == 0) return;
        GetById()
    },[isEditing, presets])

    return (
        <form className={s.activityForm} onSubmit={formik.handleSubmit}>
            <h4>{t("addActivity")}</h4>
            <DropdownField
                type="text"
                fieldName="preset"
                formik={formikPresets}
                value={formikPresets.values.preset}
                options={presets}
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
                                {t("errorValue")}:{" "}
                                {formik.values.activity.errorValue}
                            </p>
                        )}
                        {formik.values.activity && (
                            <form
                                className={s.wrapperAddActuators}
                                onSubmit={formikOtherActivities.handleSubmit}>
                                {otherActivities.length > 0 &&
                                    otherActivities.map((activity) => {
                                        return (
                                            <div
                                                className={
                                                    s.wrapperEachActuatorSaved
                                                }>
                                                <Field
                                                    type="text"
                                                    fieldName="name"
                                                    readOnly={true}
                                                    isLogged={true}
                                                    value={
                                                        activity.otherActivity
                                                            .name
                                                    }
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
                                        value={
                                            formikOtherActivities.values
                                                .activity
                                        }
                                        options={enumActivities}
                                        readOnly={false}
                                    />
                                    <Field
                                        type="number"
                                        fieldName="probability"
                                        readOnly={false}
                                        formik={formikOtherActivities}
                                        isLogged={true}
                                        hasStep={true}
                                        value={
                                            formikOtherActivities.values
                                                .probability
                                        }
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        formikOtherActivities.handleSubmit()
                                    }>
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
                                            <div
                                                className={
                                                    s.wrapperEachActuatorSaved
                                                }>
                                                <Field
                                                    type="text"
                                                    fieldName="name"
                                                    readOnly={true}
                                                    isLogged={true}
                                                    value={
                                                        actuator.actuator.name
                                                    }
                                                />
                                                {actuator.status.length > 0 &&
                                                    actuator.status.map(
                                                        (prop) => {
                                                            return (
                                                                <Field
                                                                    type="text"
                                                                    fieldName={
                                                                        prop.name
                                                                    }
                                                                    readOnly={
                                                                        true
                                                                    }
                                                                    isLogged={
                                                                        true
                                                                    }
                                                                    value={
                                                                        prop.value
                                                                    }
                                                                />
                                                            );
                                                        }
                                                    )}
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
                                <RenderActuatorProps
                                    formikParam={formikActuators}
                                />
                                <div className={s.wrapperActuatorsActions}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            formikActuators.handleSubmit()
                                        }>
                                        {t("addActuator")}
                                        <IoMdAdd />
                                    </button>
                                    <button
                                        type="button"
                                        className={s.removeActuators}
                                        onClick={() => {
                                            if (actuatorsProps.length > 0) {
                                                setActuatorsProps(
                                                    actuatorsProps.slice(0, -1)
                                                );
                                            }
                                        }}>
                                        {t("removeActuator")}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
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
                    type="submit"
                    text={t("save")}
                    backgroundColor={"primary"}
                    height={42}
                />
            </div>
        </form>
    );
}
