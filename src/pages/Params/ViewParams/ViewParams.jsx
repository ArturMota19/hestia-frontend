// Components
import Header from "../../../basics/Header/Header";
// Images
import peopleParam from "../../../assets/icons/params/people-param.svg";
import actuatorParam from "../../../assets/icons/params/actuator-param.svg";
import roomParam from "../../../assets/icons/params/room-param.svg";
import activityParam from "../../../assets/icons/params/activity-param.svg";
import { IoMdSearch } from "react-icons/io";
// Imports
import { Helmet } from "react-helmet";
import { BaseRequest } from "../../../services/BaseRequest";
import { useFormik } from "formik";
import Field from "../../../basics/Field/Field";
//Styles
import s from "./ViewParams.module.scss";
import { useTranslation } from "react-i18next";
import ViewComponent from "../../../basics/ViewComponent/ViewComponent";
import { useEffect, useState } from "react";
import Button from "../../../basics/Button/Button";
import { PuffLoader } from "react-spinners";
import ModalCreateParams from "../../../basics/ModalCreateParams/ModalCreateParams";
import AddActivityModal from "../../../basics/RoutineModal/AddActivityModal";
import toast from "react-hot-toast";

export default function ViewParams() {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [paramType, setParamType] = useState("people"); // people, activity, room
    const [data, setData] = useState([]);
    const [itemsCount, setItemsCount] = useState(1);
    const itemsPerPage = 6;
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [type, setType] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [dataIsEditing, setDataIsEditing] = useState("");
    const [isSearch, setIsSearch] = useState(false);

    async function FilteredData(value) {
        const response = await BaseRequest({
            method: "GET",
            url: `/${paramType}/getByFilter/${value}`,
            isAuth: true,
            setIsLoading,
        });
        console.log(response);
        if (response.status == 200) {
            setData(response.data[paramType]);
        }
    }

    const formik = useFormik({
        initialValues: {
            search: "",
        },
        onSubmit: async (values) => {
            if (values.search.length < 3) return;
            FilteredData(values.search);
        },
    });

    async function FetchData() {
        const response = await BaseRequest({
            method: "GET",
            url: `/${paramType}/getAll/${currentPage}`,
            isAuth: true,
            setIsLoading,
        });
        if (response.status == 200) {
            setData(response.data[paramType]);
            setItemsCount(response.data.count);
        }
    }
    useEffect(() => {
        FetchData();
    }, [currentPage, paramType]);

    useEffect(() => {
        if (formik.values.search.length > 2) {
            setIsSearch(true);
            return;
        }
        FetchData();
        setIsSearch(false);
    }, [formik.values.search]);

    async function DeleteData(id) {
        const response = await BaseRequest({
            method: "DELETE",
            url: `/${paramType}/deleteById/${id}`,
            isAuth: true,
            setIsLoading,
        });
        if (response.status == 200) {
            toast.success("Parâmetro deletado com sucesso.");
            FetchData();
        }
    }

    const totalPages = Math.ceil(itemsCount / itemsPerPage);

    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    function handleOpenModal(type) {
        setIsModalOpen(true);
        setType(type);
    }

    const ItemParam = ({ noCreate = false, img, text, type }) => {
        return (
            <div className={s.itemParam}>
                <Button
                    text={!noCreate ? t("create") : t("view")}
                    backgroundColor={"secondary"}
                    height={48}
                    doFunction={() => {
                        handleOpenModal(type);
                    }}
                />
            </div>
        );
    };

    return (
        <main className={s.wrapperViewParams}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>HESTIA | View Params</title>
            </Helmet>
            <Header />
            <ModalCreateParams
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                type={type}
                FetchData={FetchData}
            />
            <AddActivityModal
                isActivityModalOpen={isActivityModalOpen}
                setIsActivityModalOpen={setIsActivityModalOpen}
                FetchData={FetchData}
                isEditing={isEditing}
                dataIsEditing={dataIsEditing}
            />
            <section className={s.hestiaInfoWrapper}>
                <h1>{t("viewHouseParams")}</h1>
                <section className={s.wrapperButtons}>
                    <Button
                        text={t("people")}
                        backgroundColor={
                            paramType == "people" ? "primary" : "secondary"
                        }
                        height={36}
                        doFunction={() => {
                            setParamType("people");
                            setCurrentPage(1);
                        }}
                    />
                    <Button
                        text={t("activities")}
                        backgroundColor={
                            paramType == "activities" ? "primary" : "secondary"
                        }
                        height={36}
                        doFunction={() => {
                            setParamType("activities");
                            setCurrentPage(1);
                        }}
                    />
                    <Button
                        text={t("rooms")}
                        backgroundColor={
                            paramType == "rooms" ? "primary" : "secondary"
                        }
                        height={36}
                        doFunction={() => {
                            setParamType("rooms");
                            setCurrentPage(1);
                        }}
                    />
                    <Button
                        text={t("actuators")}
                        backgroundColor={
                            paramType == "actuators" ? "primary" : "secondary"
                        }
                        height={36}
                        doFunction={() => {
                            setParamType("actuators");
                            setCurrentPage(1);
                        }}
                    />
                    <Button
                        text={t("activitiesPresetParamRoutes")}
                        backgroundColor={
                            paramType == "activitiesPresetParamRoutes"
                                ? "primary"
                                : "secondary"
                        }
                        height={36}
                        doFunction={() => {
                            setParamType("activitiesPresetParamRoutes");
                            setCurrentPage(1);
                        }}
                    />
                </section>
                {paramType !== "actuators" && (
                    <div className={s.wrapperCreateParams}>
                        <div className={s.wrapperInput}>
                            <IoMdSearch size={50} color="#333333"/>
                            <Field
                                fieldName="search"
                                type="text"
                                isLogged={true}
                                formik={formik}
                                isSearch={true}
                            />
                        </div>
                        <div className={s.wrapperButton}>
                            {paramType == "activitiesPresetParamRoutes" ? (
                                <Button
                                    text={t("create")}
                                    backgroundColor={"secondary"}
                                    height={48}
                                    doFunction={() => {
                                        setIsEditing(false);
                                        setIsActivityModalOpen(true);
                                    }}
                                />
                            ) : (
                                <ItemParam
                                    img={peopleParam}
                                    text={t(paramType)}
                                    type={paramType}
                                />
                            )}
                        </div>
                    </div>
                )}
                <section className={s.gridWrapper}>
                    {data.length > 0 &&
                        !isLoading &&
                        data.map((item, index) => (
                            <ViewComponent
                                index={index}
                                title={item.paramName}
                                actuatorSpec={item.actuatorSpec}
                                capacity={item.capacity}
                                type={item.type}
                                hasActions={item.type == "actuators"}
                                image={
                                    item.type === "person"
                                        ? peopleParam
                                        : item.type === "actuator"
                                        ? actuatorParam
                                        : item.type === "room"
                                        ? roomParam
                                        : activityParam
                                }
                                id={item.id}
                                DeleteData={DeleteData}
                                setIsEditing={(status) => setIsEditing(status)}
                                setDataIsEditing={setDataIsEditing}
                                setIsActivityModalOpen={setIsActivityModalOpen}
                            />
                        ))}
                </section>
                {data.length <= 0 && !isLoading && (
                    <div className={s.noParamsDiv}>
                        {isSearch ? (
                            <h4>{t("noParamsSearched")}</h4>
                        ) : (
                            <h4>
                                {t("noParams")} {t(paramType)}
                            </h4>
                        )}
                    </div>
                )}
                {data.length <= 0 && isLoading && (
                    <div className={s.loadingWrapper}>
                        <PuffLoader
                            size={100}
                            color={"var(--primary-color)"}
                            speedMultiplier={1}
                        />
                    </div>
                )}
                {data.length > 0 && !isSearch && (
                    <div className={s.pagination}>
                        <Button
                            text={t("prev")}
                            backgroundColor={
                                currentPage === 1 ? "secondary" : "primary"
                            }
                            height={36}
                            disabled={currentPage === 1}
                            doFunction={handlePrev}
                        />
                        <span>
                            {currentPage} de {totalPages}
                        </span>
                        <Button
                            text={t("next")}
                            backgroundColor={
                                currentPage === totalPages
                                    ? "secondary"
                                    : "primary"
                            }
                            height={36}
                            disabled={currentPage === totalPages}
                            doFunction={handleNext}
                        />
                    </div>
                )}
            </section>
        </main>
    );
}
