// Components
// Images
// Imports
import { Password } from "primereact/password";
import { useTranslation } from "react-i18next";
// Styles
import s from './PasswordField.module.scss'


export default function PasswordField({
  id,
  fieldName,
  redirectLink = "",
  toggleMask,
  passwordPanel,
  readOnly,
  formik,
  currentTheme,
}) {
  const { t } = useTranslation();
  // Component Variables
  const header = <div className={s.header}>Escolha uma senha</div>;
  const PasswordRequirements = ({
    isLowercase,
    isUppercase,
    isNumber,
    isLengthValid,
  }) => {
    return (
      <div className={s.passwordRequirements}>
        <p>Pelo menos uma letra minúscula {isLowercase ? "✔" : ""}</p>
        <p>Pelo menos uma letra maiúscula {isUppercase ? "✔" : ""}</p>
        <p>Pelo menos um número {isNumber ? "✔" : ""}</p>
        <p>Mínimo de 8 caracteres {isLengthValid ? "✔" : ""}</p>
      </div>
    );
  };

  return (
    <main className={s.inputWrapper} aria-hidden="false">
      <div className={s.labelWrapper}>
        <p className={s.label}>{t(fieldName)}</p>
        {redirectLink && (
          <>
            <p className={s.redirectLabel}>Esqueceu a <a href={redirectLink}>senha?</a></p>
          </>
        )}
      </div>
      <Password
        id={id}
        name={fieldName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[fieldName]}
        readOnly={readOnly}
        toggleMask={toggleMask}
        placeholder={t(`${fieldName}Placeholder`) || ""}
        feedback={passwordPanel}
        weakLabel="Fraca"
        mediumLabel="Média"
        strongLabel="Forte"
        promptLabel="..."
        className={
          formik.errors[fieldName] && formik.touched[fieldName]
            ? s.fieldError
            : ""
        }
        header={header}
        footer={
          <PasswordRequirements
            isLowercase={/[a-z]/.test(formik.values[fieldName])}
            isUppercase={/[A-Z]/.test(formik.values[fieldName])}
            isNumber={/[0-9]/.test(formik.values[fieldName])}
            isLengthValid={formik.values[fieldName]?.length >= 8}
          />
        }
        panelClassName={`${s.passwordPanel} ${currentTheme + "-theme"}`}
      />
      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <p className={s.textError}>{formik.errors[fieldName]}</p>
      )}
    </main>
  );
}
