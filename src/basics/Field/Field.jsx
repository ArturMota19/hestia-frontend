// Components
// Images
// Imports
import { useTranslation } from 'react-i18next';
// Styles
import s from './Field.module.scss'

export default function Field({
  type = "text",
  fieldName,
  readOnly = false,
  formik,
  value = "",
  isLogged = false,
}) {
  const { t } = useTranslation();

  if(!formik && readOnly){
    return(
      <input
        type={type}
        name={fieldName}
        disabled={true}
        value={value}
        readOnly={readOnly}
        className={s.field}
      />
    )
  }

  return (
    <div className={s.inputWrapper}>
      <label
        className={isLogged ? `${s.label} ${s.internColors}` : `${s.label} ${s.notInternColors}`}
      >
        {t(fieldName)}
      </label>
      <input
        type={type}
        name={fieldName}
        onChange={(e) => formik.handleChange(e)}
        onBlur={formik.handleBlur}
        value={value || (formik?.values[fieldName] || "")}
        readOnly={readOnly}
        placeholder={t(`${fieldName}Placeholder`)}
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
