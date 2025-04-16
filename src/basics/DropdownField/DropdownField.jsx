// Components

// Images

// Imports
import { Dropdown } from "primereact/dropdown";
import {  MultiSelect } from "primereact/multiselect";
// Styles
import s from './DropdownField.module.scss'
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function DropdownField({
  type = "text",
  fieldName,
  readOnly = false,
  formik,
  value = "",
  options = [],
  isMultiSelect = false,
}) {
  const optionTemplate = (option) => {
    return <div>{option.name}</div>;
  };
  const {t} = useTranslation();
  if(isMultiSelect){
    const hasError = formik.touched[fieldName] && formik.errors[fieldName];
    return (
      <div className={s.inputWrapper}>
        <label className={s.label}>{t(fieldName)}</label>
        <MultiSelect
          id={`input-${fieldName}`}
          name={fieldName}
          optionLabel="name"
          value={formik?.values[fieldName]}
          options={options}
          itemTemplate={optionTemplate}
          onChange={(e) => formik.setFieldValue(fieldName, e.value)}
          onBlur={formik.handleBlur}
          readOnly={readOnly}
          placeholder={
            formik?.values[fieldName]?.length === 0
              ? t('select') // ou outro texto como "Selecione"
              : ""
          }
          className={
            hasError ? `${s.field} ${s.fieldError}` : `${s.field}`
          }
        />
        {hasError && (
          <p className={s.textError}>{formik.errors[fieldName]}</p>
        )}
      </div>
    );
  }
  return (
    <div className={s.inputWrapper}>
      <label className={s.label}>{t(fieldName)}</label>
      <Dropdown
        type={type}
        name={fieldName}
        onBlur={formik.handleBlur}
        value={formik?.values[fieldName]}
        readOnly={readOnly}
        placeholder={(formik?.values[fieldName] || t('select'))}
        options={options}
        filter={options.length > 5}
        filterPlaceholder="Pesquisar"
        emptyFilterMessage="Sem resultado"
        onChange={(e) => formik.setFieldValue(fieldName, e.value.name)}
        itemTemplate={optionTemplate}
        panelClassName={s.panelDropdown}
        className={
          formik.errors[fieldName] && formik.touched[fieldName]
            ? s.fieldError
            : s.field
        }
      />
    {formik.touched[fieldName] && formik.errors[fieldName] && (
      <p className={s.textError}>{formik.errors[fieldName]}</p>
    )}
    </div>

  );
}