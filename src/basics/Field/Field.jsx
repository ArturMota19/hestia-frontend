// Components
// Images
// Imports
// Styles
import s from './Field.module.scss'

export default function Field({
  type = "text",
  fieldName,
  label,
  labelColor = "",
  isCurrencyInput = false,
  readOnly = false,
  placeholder = "Digite...",
  formik,
  value = "",
}) {

  return (
    <main className={s.inputWrapper}>
      <p
        className={s.label}
      >
        {label}
      </p>
      <input
        type={type}
        name={fieldName}
        onChange={(e) => formik.handleChange(e)}
        onBlur={formik.handleBlur}
        value={value || (formik?.values[fieldName] || "")}
        readOnly={readOnly}
        placeholder={placeholder}
        className={
          formik.errors[fieldName] && formik.touched[fieldName]
            ? s.fieldError
            : s.field
        }
      />
      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <p className={s.textError}>{formik.errors[fieldName]}</p>
      )}
    </main>
  );
}
