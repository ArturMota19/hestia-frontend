import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations

const resources = {
  pt: {
    translation: {
      // Inputs Actions
      create: 'Criar',
      createAccount: 'Criar Conta',
      edit: 'Editar',
      delete: 'Deletar',
      save: 'Salvar',
      cancel: 'Cancelar',
      login: 'Logar-se',
      logout: 'Sair',
      register: 'Registrar-se',
      entry: 'Entrar',
      // Inputs Labels
      email: 'Email',
      password: 'Senha',
      name: 'Nome',
      confirmpassword: 'Confirmar Senha',
      // Inputs Placeholders
      emailPlaceholder: 'Digite seu email',
      passwordPlaceholder: 'Digite sua senha',
      namePlaceholder: 'Digite seu nome',
      confirmpasswordPlaceholder: 'Confirme sua senha',
      // Inputs Errors
      requiredField: 'Campo obrigatório',
      invalidEmail: 'Email inválido',
      passwordMismatch: 'As senhas não coincidem',
      //Home
      createParams: 'Criar Parâmetros',
      seeParams: 'Visualizar Parâmetros',
      createPresets: 'Criar Presets',
      seePresets: 'Visualizar Presets',
      createRoutines: 'Criar Rotinas',
      seeRoutines: 'Visualizar Rotinas',
      // Add more translations here
    }
  },
  en: {
    translation: {
      // Inputs Actions
      create: 'Create',
      createAccount: 'Create Account',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      entry: 'Sign In',
      // Inputs Labels
      email: 'Email',
      password: 'Password',
      name: 'Name',
      confirmpassword: 'Confirm Password',
      // Inputs Placeholders
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      namePlaceholder: 'Enter your name',
      confirmpasswordPlaceholder: 'Confirm your password',
      // Inputs Errors
      requiredField: 'Required field',
      invalidEmail: 'Invalid email',
      passwordMismatch: 'Passwords do not match',
      //Home
      createParams: 'Create Parameters',
      seeParams: 'View Parameters',
      createPresets: 'Create Presets',
      seePresets: 'View Presets',
      createRoutines: 'Create Routines',
      seeRoutines: 'View Routines',
      // Add more translations here
    }
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'pt',
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false // React already does escaping
  }
});