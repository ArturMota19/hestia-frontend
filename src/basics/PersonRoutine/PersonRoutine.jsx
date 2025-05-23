// Components

// Images
import { MdModeEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
// Imports

// Styles
import { useTranslation } from "react-i18next";
import s from "./PersonRoutine.module.scss";
import Button from "../Button/Button";
import { useState } from "react";
import { BaseRequest } from "../../services/BaseRequest";
import toast from "react-hot-toast";

export default function PersonRoutine({ person, setIsModalOpen, setPerson, setWeekDay, preset, ResetPreset }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false)

  function openModal(day){
    setPerson(person)
    setWeekDay(day)
    setIsModalOpen(true)
  }

  const EachDay = ({ day }) => {
    const sortedRoutine = [...day.routine].sort((a, b) => a.start - b.start);

    return (
      <div className={s.eachDayWrapper}>
      <div className={s.dayName}>
        <h4>{t(day.dayName)}</h4>
        <div className={s.internActionsButton}>
        {day.routine.length > 0 ? (
          <button onClick={() => openModal(day)}>
          <MdModeEdit />
          </button>
        ) : (
          <button onClick={() => openModal(day)}>
          <IoMdAdd />
          </button>
        )}
        </div>
      </div>
      <div className={s.routineActions}>
        {sortedRoutine.map((activity) => {
        const totalDuration = sortedRoutine.reduce((sum, act) => sum + act.duration, 0);
        const widthPercentage = (activity.duration / totalDuration) * 100;
        return (
          <div
          key={activity.id}
          className={s.activityBlock}
          title={activity.title}
          style={{ width: `${widthPercentage}%`, backgroundColor: activity.color }}
          >
          </div>
        );
        })}
      </div>
      </div>
    );
  };

  async function DeletePersonFromPreset(){
    const response = await BaseRequest({
      method: "DELETE",
      url: "routines/deletePersonFromPreset",
      data:{
        personId: person.peopleId,
        housePresetId: preset.id
      },
      isAuth: true,
      setIsLoading,
    })
    if(response.status == 200){
      toast.success("Pessoa deletada com sucesso do Preset.")
      ResetPreset()
    }

  }

  return (
    <section className={s.wrapperEachPerson}>
      <div className={s.wrapperHeaderPerson}>
        <h3>{person.peopleName}</h3>
        <Button
          text={t("remove")}
          backgroundColor={"delete"}
          height={32}
          doFunction={() => DeletePersonFromPreset()}
          isLoading={isLoading}
        />
      </div>
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
