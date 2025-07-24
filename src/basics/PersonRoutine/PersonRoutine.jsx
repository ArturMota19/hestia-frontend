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
import { useState } from "react";
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

    function openModal(day) {
        setPerson(person);
        setWeekDay(day);
        setIsModalOpen(true);
    }

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
                let finalData = {
                    [person["peopleName"]]: {
                        nome: person.peopleName,
                        prioridade: values.priority,
                        comodo_atual: "RUA",
                        preferencia: {},
                    },
                };
                actuatorsProps.forEach((item) => {
                    const comodo = item.room.name
                        .toLowerCase()
                        .replace(/\s+/g, "_");
                    const atuador = item.actuator.name.toUpperCase();

                    if (!finalData[person.peopleName].preferencia[comodo]) {
                        finalData[person.peopleName].preferencia[comodo] = {};
                    }

                    if (
                        !finalData[person.peopleName].preferencia[comodo][
                            atuador
                        ]
                    ) {
                        finalData[person.peopleName].preferencia[comodo][
                            atuador
                        ] = {};
                    }
                    item.status.forEach((statusItem) => {
                        finalData[person.peopleName].preferencia[comodo][
                            atuador
                        ][statusItem.name] = statusItem.value;
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
                        <button type="button" onClick={() => setPersonPriorityModal(false)}>
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
                <Button
                    text={t("registerPriority")}
                    backgroundColor={"primary"}
                    height={32}
                    doFunction={() => setPersonPriorityModal(true)}
                    isLoading={isLoading}
                />
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
