import { useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import s from "./RoutineModal.module.scss";

export default function RoutineModal({ isOpen, setIsOpen }) {
  if (!isOpen) return null;

  // items array
  const [items, setItems] = useState([
    { id: 1, title: "Dormir", start: 0, duration: 6 },
    { id: 2, title: "Tomar Banho", start: 13, duration: 1 },
    { id: 3, title: "Ver televisão", start: 21, duration: 1 },
  ]);
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
      console.log(
        `Title: ${item.title}, Start: ${item.start}, Duration: ${item.duration}`
      );
    });
  }

  return (
    <section className={s.wrapperModal}>
      <div className={s.timeline}>
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
          <button onClick={() => PrintEvents()}>TEST ACTIVITIES</button>
          {/* Activities */}
          <div className={s.events}>
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
                    maxConstraints={[(timeSlots - item.start) * gridSize, rowHeight - 10]}
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
                      {item.title}
                    </div>
                  </ResizableBox>
                </div>
              </Draggable>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
