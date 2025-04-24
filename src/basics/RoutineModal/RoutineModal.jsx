import { useState } from 'react';
import s from './RoutineModal.module.scss';

const Activities = {
  SLEEP: 'Dormir',
  BATH: 'Banho',
  BREAKFAST: 'Café da Manhã',
};

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2).toString().padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

export default function RoutineModal({ isOpen, setIsOpen }) {
  const [blocks, setBlocks] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  if (!isOpen) return null;

  const handleSlotClick = (index) => {
    const activityKey = prompt('Digite o código da atividade (ex: SLEEP, BATH, BREAKFAST)');
    if (!Activities[activityKey]) return alert('Atividade inválida!');

    setBlocks([...blocks, {
      start: index,
      duration: 2, // 1h por padrão
      activity: activityKey,
    }]);
  };

  const handleResize = (index, direction) => {
    setBlocks(blocks.map(block => {
      if (block.start === index) {
        return {
          ...block,
          duration: Math.max(1, block.duration + direction)
        };
      }
      return block;
    }));
  };

  return (
    <section className={s.wrapperModal}>
      <div className={s.grid}>
        {TIME_SLOTS.map((time, i) => (
          <div key={i} className={s.timeSlot} onClick={() => handleSlotClick(i)}>
            {time}
          </div>
        ))}
        {blocks.map((block, idx) => (
          <div
            key={idx}
            className={s.block}
            style={{
              top: `${block.start * 30}px`,
              height: `${block.duration * 30}px`,
              backgroundColor: getColor(block.activity),
            }}
          >
            {Activities[block.activity]?.substring(0, 4)}
            <div className={s.resizer} onClick={() => handleResize(block.start, 1)}>⬇</div>
            <div className={s.resizer} onClick={() => handleResize(block.start, -1)}>⬆</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function getColor(key) {
  return {
    SLEEP: '#2196f3',
    BATH: '#e91e63',
    BREAKFAST: '#4caf50',
  }[key] || '#9e9e9e';
}
