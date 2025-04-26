// Components

// Images
import { MdModeEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
// Imports

// Styles
import { useTranslation } from "react-i18next";
import s from "./PersonRoutine.module.scss";

export default function PersonRoutine({ person }) {
  const { t } = useTranslation();

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
              <button>
                <IoMdAdd />
              </button>
            )}
          </div>
        </div>
        <div className={s.routineActions}>shdfgjsdhiugsd</div>
      </div>
    );
  };

  return (
    <section className={s.wrapperEachPerson}>
      <h3>{person.person}</h3>
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
