// Components

// Images
import { MdModeEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import closeIcon from "../../assets/icons/basicIcons/close-icon.svg";
// Imports
import * as Yup from "yup";
import { useFormik } from "formik";
import Field from "../Field/Field";
// Styles
import { useTranslation } from "react-i18next";
import s from "./PersonRoutine.module.scss";
import Button from "../Button/Button";
import { useEffect, useState } from "react";
import { BaseRequest } from "../../services/BaseRequest";
import toast from "react-hot-toast";
import DropdownField from "../DropdownField/DropdownField";
import RenderActuatorProps from "../RoutineModal/RenderActuatorProps";

export default function PersonRoutine({
    person,
    setIsModalOpen,
    setPerson,
    setWeekDay,
    preset,
    ResetPreset,
}) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [personPriorityModal, setPersonPriorityModal] = useState(false);
    const [peopleRoutinePreset, setPeopleRoutinePreset] = useState();
    const [shouldOverlapPriority, setShouldOverlapPriority] = useState({
      state: false,
      priority: 0
    })

    async function GetPeopleRoutinePreset() {
        const responseRoutineId = await BaseRequest({
            method: "GET",
            url: `routines/getPeopleRoutinesByPresetId/${preset.id}`,
            isAuth: true,
            setIsLoading,
        });

        if (responseRoutineId.status == 200) {
            const foundPerson = responseRoutineId.data.find(
                (item) => item.peopleName === person.peopleName
            );
            setPeopleRoutinePreset(foundPerson);
        }
    }
    useEffect(() => {
        GetPeopleRoutinePreset();
    }, []);

    function openModal(day) {
        setPerson(person);
        setWeekDay(day);
        setIsModalOpen(true);
    }

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

    const EachDay = ({ day }) => {
        const sortedRoutine = [...day.routine].sort(
            (a, b) => a.start - b.start
        );
        const totalDuration = sortedRoutine.reduce(
            (sum, act) => sum + act.duration,
            0
        );
        const remainingDuration = 48 - totalDuration;
        const isIncomplete = totalDuration < 48;

        return (
            <div className={s.eachDayWrapper}>
                <div className={s.dayName}>
                    <h4 className={isIncomplete ? s.incompleteDay : ""}>
                        {t(day.dayName)}
                    </h4>
                    <div className={s.internActionsButton}>
                        <button onClick={() => openModal(day)}>
                            {day.routine.length > 0 ? (
                                <MdModeEdit />
                            ) : (
                                <IoMdAdd />
                            )}
                        </button>
                    </div>
                </div>

                <div className={s.routineActions}>
                    {sortedRoutine.map((activity) => {
                        const widthPercentage = (activity.duration / 48) * 100;
                        return (
                            <div
                                key={activity.id}
                                className={s.activityBlock}
                                title={activity.title}
                                style={{
                                    width: `${widthPercentage}%`,
                                    backgroundColor: activity.color,
                                }}
                            />
                        );
                    })}

                    {remainingDuration > 0 && (
                        <div
                            className={s.activityBlock}
                            style={{
                                width: `${(remainingDuration / 48) * 100}%`,
                                backgroundColor: "#ccc",
                                opacity: 0.5,
                                cursor: "not-allowed",
                            }}
                            title={`${remainingDuration * 30}min livres`}
                        />
                    )}
                </div>
            </div>
        );
    };

    async function DeletePersonFromPreset() {
        const response = await BaseRequest({
            method: "DELETE",
            url: "routines/deletePersonFromPreset",
            data: {
                personId: person.peopleId,
                housePresetId: preset.id,
            },
            isAuth: true,
            setIsLoading,
        });
        if (response.status == 200) {
            toast.success("Pessoa deletada com sucesso do Preset.");
            ResetPreset();
        }
    }

    const days = [
        person.monday,
        person.tuesday,
        person.wednesday,
        person.thursday,
        person.friday,
        person.saturday,
        person.sunday,
    ];

    const hasIncompleteDay = days.some(
        (day) => day.routine.reduce((sum, act) => sum + act.duration, 0) < 48
    );

    const PeoplePreferences = () => {
        if (!personPriorityModal) return;
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
                try {
                    const preferences = [];
                    actuatorsProps.forEach((item) => {
                        preferences.push(item);
                    });
                    const data = {
                        peopleRoutinesId: peopleRoutinePreset
                            ? peopleRoutinePreset.id
                            : "",
                        priority: values.priority,
                        preferences: preferences,
                        presetId: preset.id
                    };
                    const responseRegisterPreference = await BaseRequest({
                        method: "POST",
                        data,
                        url: `peoplePriority/register`,
                        isAuth: true,
                        setIsLoading,
                    });
                    console.log(responseRegisterPreference);
                    if(responseRegisterPreference.status == 201){
                      toast.success("Prioridade cadastrada com sucesso.")
                      setPersonPriorityModal(false)
                      setShouldOverlapPriority({ priority: responseRegisterPreference.data.priority, state: true })
                    }
                } catch (e) {}
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
                    toast.error(
                        "Adicione ao menos uma propriedade para o atuador."
                    );
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
            <section className={s.wrapperModalPreferences}>
                <form
                    onSubmit={formikPreferences.handleSubmit}
                    className={s.formWrapperIntern}>
                    <div className={s.closeModal}>
                        <button
                            type="button"
                            onClick={() => setPersonPriorityModal(false)}>
                            <img src={closeIcon} alt="Close Modal" />
                        </button>
                    </div>
                    <h3>{person.peopleName}</h3>
                    <Field
                        type="number"
                        fieldName="priority"
                        formik={formikPreferences}
                        isLogged={true}
                    />
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
                                options={preset.houserooms}
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
                                        options={
                                            formik.values.room.roomactuators
                                        }
                                        readOnly={false}
                                        hasTranslation={true}
                                    />
                                    <RenderActuatorProps
                                        formikParam={formikActuators}
                                    />
                                </form>
                            )}
                        </div>
                    </div>
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
            </section>
        );
    };

    return (
        <section className={s.wrapperEachPerson}>
            <PeoplePreferences />
            <div className={s.wrapperHeaderPerson}>
                <h3>{person.peopleName}</h3>
                
                {!shouldOverlapPriority.state ? (peopleRoutinePreset &&
                    peopleRoutinePreset?.priority == null) ? (
                        <Button
                            text={t("registerPriority")}
                            backgroundColor={"primary"}
                            height={32}
                            doFunction={() => setPersonPriorityModal(true)}
                            isLoading={isLoading}
                        />
                    )
                  :
                  <p>{t("priority")}: {peopleRoutinePreset?.priority}</p>
                  :
                  <p>{t("priority")}: {shouldOverlapPriority?.priority}</p>
                  }

                <Button
                    text={t("remove")}
                    backgroundColor={"delete"}
                    height={32}
                    doFunction={() => DeletePersonFromPreset()}
                    isLoading={isLoading}
                />
            </div>
            {hasIncompleteDay && (
                <div className={s.incompleteMessage}>
                    <p>⚠️ {t("someDayIsIncomplete")}</p>
                </div>
            )}
            <div>
                <EachDay day={person.monday} />
                <EachDay day={person.tuesday} />
                <EachDay day={person.wednesday} />
                <EachDay day={person.thursday} />
                <EachDay day={person.friday} />
                <EachDay day={person.saturday} />
                <EachDay day={person.sunday} />
            </div>
        </section>
    );
}
