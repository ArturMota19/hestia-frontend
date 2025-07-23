// Components
// Images

// Imports
import Button from "../../basics/Button/Button";
import { useTranslation } from "react-i18next";
//Styles
import s from "./ViewComponent.module.scss";
import { useNavigate } from "react-router-dom";

export default function ViewComponent({
    index,
    title,
    room = [],
    actuatorSpec = [],
    people = [],
    capacity = null,
    type,
    image = "/",
    hasActions = false,
    id = "",
    DeleteData = false,
    setIsEditing=false,
    setDataIsEditing=false,
    setIsActivityModalOpen=false
}) {
    const { t } = useTranslation();
    const columns = 2;
    const row = Math.floor(index / columns);
    const col = index % columns;
    const isEvenRow = row % 2 === 0;

    const isColorA = (isEvenRow && col === 0) || (!isEvenRow && col === 1);

    const navigate = useNavigate();
    console.log(type)

    return (
        <div
            key={index}
            className={
                isColorA
                    ? `${s.wrapperViewComponent} ${s.oddColor}`
                    : `${s.wrapperViewComponent} ${s.evenColor}`
            }>
            <div className={s.wrapperInfo}>
                {people.length > 0 ? (
                    <h5>
                        {t("routine")} - {title}
                    </h5>
                ) : (
                    <h5>{title}</h5>
                )}
                {capacity && (
                    <p>
                        {t("capacity")}: {capacity}
                    </p>
                )}
                {room.length > 0 && (
                    <p>
                        {t("rooms")}: {room.join(", ")}
                    </p>
                )}
                {actuatorSpec.length > 0 &&
                    actuatorSpec.map((spec, index) => {
                        const [key, value] = Object.entries(spec)[0];
                        return (
                            <p key={index}>
                                {t(`${key}`)} - {value ? t("yes") : t("no")}
                            </p>
                        );
                    })}
                {people.length > 0 && (
                    <p>
                        {t("people")}: {people.join(", ")}
                    </p>
                )}
                {type !== "preset" && (
                    <div className={s.buttonsDiv}>
                        {(type === "routine" || type === "activityPresetParam") && (
                        <Button
                            text={t("edit")}
                            backgroundColor={"secondary"}
                            height={36}
                            doFunction={() => {
                            if (type === "routine") {
                                navigate("/create-routines?edit=true");
                            } else if (type === "preset") {
                                navigate(`/create-presets?id=${id}`);
                            } else if (type === "activityPresetParam") {
                                setIsEditing(true);
                                setDataIsEditing(id)
                                setIsActivityModalOpen(true)
                            } else {
                                console.log("edit");
                            }
                            }}
                        />
                        )}
                        {type !== "actuator" &&
                        <Button
                            text={t("delete")}
                            backgroundColor={"delete"}
                            height={36}
                            doFunction={() =>
                                DeleteData
                                    ? DeleteData(id)
                                    : console.log("delete")
                            }
                        />
                        }
                    </div>
                )}
            </div>
            <img src={image} alt={type} />
        </div>
    );
}
