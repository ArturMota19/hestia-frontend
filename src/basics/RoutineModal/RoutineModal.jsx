import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import s from "./RoutineModal.module.scss";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import AddActivityModal from "./AddActivityModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import DropdownField from "../DropdownField/DropdownField";
import toast from "react-hot-toast";
import closeIcon from "../../assets/icons/basicIcons/close-icon.svg";
import { BaseRequest } from "../../services/BaseRequest";

export default function RoutineModal({
  isOpen,
  setIsOpen,
  person,
  weekDay,
  preset,
  setHasToSavePeople,
}) {
  if (!isOpen) return null;
  const { t } = useTranslation();

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activitiesParam, setActivitiesParam] = useState()

  async function GetActivityParam() {
    const response = await BaseRequest({
      method: "GET",
      url: `routines/getActivityPresetParams/${preset.id}`,
      isAuth: true,
      setIsLoading,
    });
    if (response.status == 200) {
      setActivitiesParam(response.data);
    }
  }

  useEffect(() => {
    GetActivityParam();
  }, []);

  // items array
  const [items, setItems] = useState([]);
  // items size
  const gridSize = 50; // 30m = 50px
  const timeSlots = 48; // 24h * 2
  const rowHeight = 50;

  const validationSchemaActivityParam = Yup.object().shape({
    activityPresetParam: Yup.mixed().required(t("requiredField")),
  });
  const formikActivityParam = useFormik({
    initialValues: {
      activityPresetParam: "",
    },
    validationSchema: validationSchemaActivityParam,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

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

  async function GetActivityRoutines() {
    const response = await BaseRequest({
      method: "GET",
      isAuth: true,
      url: `routines/getRoutine/${weekDay.dayId}`,
      setIsLoading,
    });
    if (response.status == 200) {
      setItems(response.data);
    }
  }

  useEffect(() => {
    GetActivityRoutines();
  }, [isActivityModalOpen]);

  async function RegisterRoutineActivity(){
    const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);
    if (totalDuration >= 48) {
      toast.error("A rotina já está completa. Não é possível adicionar mais atividades.");
      return;
    }
    if(formikActivityParam.values.activityPresetParam == "") {
      toast.error("Selecione a atividade")
      return
    }
    let data = {
      activityPresetParam: formikActivityParam.values.activityPresetParam.id,
      dayRoutineId: weekDay.dayId,
      start: items.length > 0 ? items.reduce((max, item) => Math.max(max, item.start + item.duration), 0) : 0,
      duration: 1,
    }
    const response = await BaseRequest({
      method: "POST",
      isAuth: true,
      url: `routines/registerEachRoutineActivity`,
      data,
      setIsLoading,
    });
    if(response.status == 201){
      toast.success("Atividade adicionada com sucesso.")
      formikActivityParam.resetForm()
      GetActivityRoutines()
    }
  }

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
        toast.error(
          "Não é possível redimensionar para sobrepor outra atividade!"
        );
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
      toast.error(
        `A duração total das atividades deve ser 24h. Atualmente é ${
          totalDuration / 2
        }h.`,
        {
          duration: 4000,
          position: "top-center",
        }
      );
      return;
    }
    const response = await BaseRequest({
      method: "PUT",
      url: `routines/updateRoutineActivities`,
      data: items,
      setIsLoading,
      isAuth: true,
    });
    if (response.status == 200) {
      setHasToSavePeople(false);
      toast.success("Rotina e Atividades salvas com sucesso.");
      setIsOpen(false);
    }
  }

  const [deleteActivity, setDeleteActivity] = useState("");
  const DeleteModal = () => {
    if (deleteActivity == {} || deleteActivity == "") return null;
    return (
      <div className={s.deleteModal}>
        <h5>Deletar Atividade?</h5>
        <h6>{deleteActivity.title}</h6>
        <div className={s.wrapperDeleteButtons}>
          <Button
            text={t("no")}
            backgroundColor={"primary"}
            height={42}
            doFunction={() => setDeleteActivity("")}
            isLoading={isLoading}
          />
          <Button
            text={t("yes")}
            backgroundColor={"delete"}
            height={42}
            doFunction={() => DeleteActivityRequest()}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  };

  async function DeleteActivityRequest() {
    const response = await BaseRequest({
      method: "DELETE",
      url: `routines/deleteActivity/${deleteActivity.id}`,
      isAuth: true,
      setIsLoading,
    });
    if (response.status == 200) {
      toast.success("Atividade deletada com sucesso.");
      setDeleteActivity("");
      setHasToSavePeople(false);
      GetActivityRoutines();
    }
  }

  return (
    <section className={s.wrapperModal}>
      <DeleteModal />
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
            <DropdownField
              type="text"
              fieldName="activityPresetParam"
              formik={formikActivityParam}
              value={formikActivityParam.values.activityParam}
              options={activitiesParam}
            />
            <Button
              text={t("addActivity")}
              backgroundColor={"primary"}
              height={42}
              doFunction={() => {
                RegisterRoutineActivity(true);
              }}
            />
          </section>
        </div>
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
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setDeleteActivity(item);
                        }}
                        resizeHandles={["e"]}
                        handle={
                          <span
                            className={s.resizeHandle}
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                        }>
                        <div
                          className={`${s.eventBox} drag-handle`}
                          style={{ background: item.color }}>
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
