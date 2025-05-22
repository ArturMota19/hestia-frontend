// Components

// Images
import { MdModeEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
// Imports

// Styles
import { useTranslation } from "react-i18next";
import s from "./PersonRoutine.module.scss";

export default function PersonRoutine({ person, setIsModalOpen, setPerson, setWeekDay }) {
  const { t } = useTranslation();

  function openModal(day){
    setPerson(person)
    setWeekDay(day)
    setIsModalOpen(true)
  }

  const EachDay = ({ day }) => {
    return (
      <div className={s.eachDayWrapper}>
      <div className={s.dayName}>
        <h4>{t(day.dayName)}</h4>
        <div className={s.internActionsButton}>
        {day.routine.length > 0 ? (
          <button>
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
        {day.routine.map((activity) => {
        const totalDuration = day.routine.reduce((sum, act) => sum + act.duration, 0);
        const widthPercentage = (activity.duration / totalDuration) * 100;

        return (
          <div
          key={activity.id}
          className={s.activityBlock}
          title={activity.title}
          style={{ width: `${widthPercentage}%`}} // Example color
          >
          </div>
        );
        })}
      </div>
      </div>
    );
  };

  return (
    <section className={s.wrapperEachPerson}>
      <h3>{person.peopleName}</h3>
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
