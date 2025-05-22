import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import s from "./RoutineModal.module.scss";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import AddActivityModal from "./AddActivityModal";
import toast from "react-hot-toast";
import closeIcon from "../../assets/icons/basicIcons/close-icon.svg";
import { BaseRequest } from "../../services/BaseRequest";

export default function RoutineModal({
  isOpen,
  setIsOpen,
  person,
  weekDay,
  preset,
  people,
  setPeople
}) {
  if (!isOpen) return null;
  const { t } = useTranslation();

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  // items array
  const [items, setItems] = useState([]);
  // items size
  const gridSize = 50; // 30m = 50px
  const timeSlots = 48; // 24h * 2
  const rowHeight = 50;

  function hasOverlap(newItem, items, ignoreId = null) {
    return items.some((item) => {
      if (item.id === ignoreId) return false; // Ignora ele mesmo
      const newStart = newItem.start;
      const newEnd = newItem.start + newItem.duration;
      const existingStart = item.start;
      const existingEnd = item.start + item.duration;
      return newStart < existingEnd && existingStart < newEnd;
    });
  }

  async function GetActivityRoutines(){
    const response = await BaseRequest({
      method: "GET",
      isAuth: true,
      url: `routines/getRoutine/${weekDay.dayId}`,
      setIsLoading,
    })
    console.log(items)
    if(response.status == 200){
      console.log(items)
      setItems(response.data)
    }
  }

  useEffect(() => {
    GetActivityRoutines()
  }, [])
  

  const handleDragStop = (e, data, id) => {
    setItems((prevItems) => {
      const newStart = Math.max(0, Math.round(data.x / gridSize));
      const currentItem = prevItems.find((item) => item.id === id);
      const newItem = { ...currentItem, start: newStart };
  
      if (hasOverlap(newItem, prevItems, id)) {
        toast.error("Não é possível mover para sobrepor outra atividade!");
        return prevItems;
      }
  
      return prevItems.map((item) =>
        item.id === id ? { ...item, start: newStart } : item
      );
    });
  };
  

  const handleResizeStop = (event, { size }, id) => {
    setItems((prevItems) => {
      const newDuration = Math.max(1, Math.round(size.width / gridSize));
      const currentItem = prevItems.find((item) => item.id === id);
      const newItem = { ...currentItem, duration: newDuration };
  
      if (hasOverlap(newItem, prevItems, id)) {
        toast.error("Não é possível redimensionar para sobrepor outra atividade!");
        return prevItems; 
      }
  
      return prevItems.map((item) =>
        item.id === id ? { ...item, duration: newDuration } : item
      );
    });
  };
  

  async function SaveRoutine() {
    const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);
    if (totalDuration !== 48) {
        toast.error(`A duração total das atividades deve ser 24h. Atualmente é ${totalDuration/2}h.`, {
            duration: 4000,
            position: 'top-center',
        });
        return;
    }
    let activities = items.map((item) => {
        const startHours = item.start / 2;
        const durationHours = item.duration / 2;
        const endHours = startHours + durationHours;
        const formatTime = (hours) => {
            const h = Math.floor(hours);
            const m = Math.round((hours - h) * 60);
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };
        return {
            id: item.id,
            title: item.title,
            startTime: formatTime(startHours),
            endTime: formatTime(endHours),
            duration: durationHours // em horas, opcional
        };
    });
    people.filter((p) => p.person === person)
    setPeople((prevPeople) =>
      prevPeople.map((p) =>
      p.person === person
        ? {
          ...p,
          [weekDay.dayName]: {
          ...p[weekDay.dayName],
          routine: activities,
          },
        }
        : p
      )
    );
    setIsOpen(false)
}

  return (
    <section className={s.wrapperModal}>
      <div className={s.timeline}>
        <div className={s.fixedHeader}>
          <div className={s.closeModal}>
              <button type="button" onClick={() => setIsOpen(false)}>
                <img src={closeIcon} alt="Close Modal" />
              </button>
            </div>
          <section className={s.titleRoutine}>
            <p>{person?.peopleName}</p>
            <p>{t(weekDay.dayName)}</p>
            <p>{preset.name}</p>
          </section>
          <section className={s.addActivityButton}>
            <Button
              text={t("addActivity")}
              backgroundColor={"primary"}
              height={42}
              doFunction={() => {
                setIsActivityModalOpen(true);
              }}
            />
          </section>
        </div>
        <AddActivityModal
          isActivityModalOpen={isActivityModalOpen}
          setIsActivityModalOpen={setIsActivityModalOpen}
          items={items}
          setItems={setItems}
          preset={preset}
          weekDay={weekDay}
        />
        {items.length > 0 && (
          <>
            <div className={s.scrollContainer}>
              {/* Hours */}
              <div className={s.hours}>
                {Array.from({ length: timeSlots }, (_, i) => {
                  const hour = Math.floor(i / 2);
                  const minute = i % 2 === 0 ? "00" : "30";
                  return (
                    <div key={i} className={s.hour} style={{ width: gridSize }}>
                      {hour}:{minute}
                    </div>
                  );
                })}
              </div>
              {/* Activities */}
              <div
                style={{ height: `${items.length * 50}px` }}
                className={s.events}>
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    axis="x"
                    bounds="parent"
                    grid={[gridSize, gridSize]}
                    position={{ x: item.start * gridSize, y: 0 }}
                    onStop={(e, data) => handleDragStop(e, data, item.id)}
                    handle=".drag-handle">
                    <div
                      style={{
                        position: "absolute",
                        top: index * rowHeight,
                        left: 0,
                      }}>
                      <ResizableBox
                        width={item.duration * gridSize}
                        height={rowHeight - 10}
                        minConstraints={[gridSize, rowHeight - 10]}
                        maxConstraints={[
                          (timeSlots - item.start) * gridSize,
                          rowHeight - 10,
                        ]}
                        axis="x"
                        onResizeStop={(e, data) =>
                          handleResizeStop(e, data, item.id)
                        }
                        resizeHandles={["e"]}
                        handle={
                          <span
                            className={s.resizeHandle}
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                        }>
                        <div className={`${s.eventBox} drag-handle`} style={{background: item.color}}>
                          <p>{item.title}</p>
                        </div>
                      </ResizableBox>
                    </div>
                  </Draggable>
                ))}
              </div>
            </div>
            <div className={s.arrayButtons}>
              <Button
                text={t("cancel")}
                backgroundColor={"secondary"}
                height={42}
                doFunction={() => {
                  setIsOpen(false);
                }}
              />
              <Button
                text={t("save")}
                backgroundColor={"primary"}
                height={42}
                doFunction={() => {
                  SaveRoutine();
                }}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
