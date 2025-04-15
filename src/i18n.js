import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations

const resources = {
  pt: {
    translation: {
      // Inputs Actions
      create: "Criar",
      createAccount: "Criar Conta",
      edit: "Editar",
      delete: "Deletar",
      save: "Salvar",
      cancel: "Cancelar",
      login: "Logar-se",
      logout: "Sair",
      register: "Registrar-se",
      entry: "Entrar",
      doRegister: "Não tem uma conta? Clique aqui para Registrar-se.",
      doLogin: "Já tem uma conta? Clique aqui para Entrar.",
      // Inputs Labels
      email: "Email",
      password: "Senha",
      name: "Nome",
      confirmpassword: "Confirmar Senha",
      // Inputs Placeholders
      emailPlaceholder: "Digite seu email",
      passwordPlaceholder: "Digite sua senha",
      namePlaceholder: "Digite seu nome",
      confirmpasswordPlaceholder: "Confirme sua senha",
      // Inputs Errors
      requiredField: "Campo obrigatório",
      invalidEmail: "Email inválido",
      passwordMismatch: "As senhas não coincidem",
      //Home
      createParams: "Criar Parâmetros",
      viewParams: "Visualizar Parâmetros",
      createPresets: "Criar Presets",
      viewPresets: "Visualizar Presets",
      createRoutines: "Criar Rotinas",
      viewRoutines: "Visualizar Rotinas",
      // Add more translations here
    },
  },
  en: {
    translation: {
      // Inputs Actions
      create: "Create",
      createAccount: "Create Account",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      login: "Login",
      logout: "Logout",
      register: "Register",
      entry: "Sign In",
      doRegister: "Don't have an account? Click here to Register.",
      doLogin: "Already have an account? Click here to Sign In.",
      // Inputs Labels
      email: "Email",
      password: "Password",
      name: "Name",
      confirmpassword: "Confirm Password",
      // Inputs Placeholders
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      namePlaceholder: "Enter your name",
      confirmpasswordPlaceholder: "Confirm your password",
      // Inputs Errors
      requiredField: "Required field",
      invalidEmail: "Invalid email",
      passwordMismatch: "Passwords do not match",
      //Home
      createParams: "Create Parameters",
      viewParams: "View Parameters",
      createPresets: "Create Presets",
      viewPresets: "View Presets",
      createRoutines: "Create Routines",
      viewRoutines: "View Routines",
      // Add more translations here
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pt',
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false // React already does escaping
  }
});