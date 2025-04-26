import { useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import s from "./RoutineModal.module.scss";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import AddActivityModal from "./AddActivityModal";

export default function RoutineModal({
  isOpen,
  setIsOpen,
  person,
  weekDay,
  presetName,
}) {
  if (!isOpen) return null;
  const { t } = useTranslation();

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // items array
  const [items, setItems] = useState([]);
  // items size
  const gridSize = 50; // 30m = 50px
  const timeSlots = 48; // 24h * 2
  const rowHeight = 50;

  const handleDragStop = (e, data, id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, start: Math.max(0, Math.round(data.x / gridSize)) }
          : item
      )
    );
  };

  const handleResizeStop = (event, { size }, id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              duration: Math.max(1, Math.round(size.width / gridSize)),
            }
          : item
      )
    );
  };

  function PrintEvents() {
    items.forEach((item) => {
      console.log(`${item.title} ${item.start} ${item.duration}`);
    });
  }

  return (
    <section className={s.wrapperModal}>
      <div className={s.timeline}>
        <div className={s.fixedHeader}>
          <section className={s.titleRoutine}>
            <p>{person}</p>
            <p>{weekDay}</p>
            <p>{presetName}</p>
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
                        <div className={`${s.eventBox} drag-handle`}>
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
                text={"Descartar Alterações"}
                backgroundColor={"secondary"}
                height={42}
                doFunction={() => {
                  PrintEvents();
                  setIsOpen(false);
                }}
              />
              <Button
                text={"Salvar Rotina"}
                backgroundColor={"primary"}
                height={42}
                doFunction={() => {
                  PrintEvents();
                  setIsOpen(false);
                }}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
