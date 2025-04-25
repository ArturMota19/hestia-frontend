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
  const gridSize = 50;
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
        {/* Hours */}
        <div className={s.hours}>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className={s.hour} style={{ width: gridSize }}>
              {i}:00
            </div>
          ))}
        </div>
        <button onClick={() => PrintEvents()}>TESTE</button>
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
                  top: index * rowHeight, // each event in one line
                  left: 0,
                }}>
                <ResizableBox
                  width={item.duration * gridSize}
                  height={rowHeight - 10}
                  minConstraints={[gridSize, rowHeight - 10]}
                  maxConstraints={[gridSize * 24, rowHeight - 10]}
                  axis="x"
                  onResizeStop={(e, data) => handleResizeStop(e, data, item.id)}
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
    </section>
  );
}
