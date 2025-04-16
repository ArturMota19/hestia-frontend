// Components

// Images

// Imports
import { Dropdown } from "primereact/dropdown";
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
  options = []
}) {
  const optionTemplate = (option) => {
    return <div>{option.name}</div>;
  };
  const {t} = useTranslation();
  useEffect(() => {
    console.log(fieldName)
    console.log(formik.values)
    console.log(formik?.values[fieldName])
  },[])
  return (
    <>
      <label>
        <p>{t(fieldName)}</p>
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
      </label>
      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <p className={s.textError}>{formik.errors[fieldName]}</p>
      )}
    </>

  );
}