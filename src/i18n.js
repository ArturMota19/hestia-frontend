import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const initialLanguage = localStorage.getItem('i18nextLng') || 'pt';
if (!initialLanguage) {
  localStorage.setItem('i18nextLng', 'pt');
}

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
      next: "Próximo",
      prev: "Anterior",
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
      select: "Selecione",
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
      // Screen Guard
      mobileOnly: "O acesso a este site não está disponível para aparelhos móveis.",
      mobileOnlyDesc: "Por favor, use um dispositivo com uma tela maior.",
      // Create Preset Page
      createHousePreset: "Criar Preset da Casa",
      rooms: "Cômodos",
      presetName: "Nome do Preset",
      presetNamePlaceholder: "Digite o nome do preset",
      roomName: "Nome do Cômodo",
      roomNamePlaceholder: "Digite o nome do quarto",
      room1: "Cômodo 1",
      room2: "Cômodo 2",
      distance: "Distância",
      distancePlaceholder: "Digite a distância",
      atuator: "Atuador",
      atuatorPlaceholder: "Selecione o atuador",
      atuators: "Atuadores",
      atuatorsPlaceholder: "Selecione os atuadores",
      roomCapacity: "Capacidade do Cômodo",
      roomCapacityPlaceholder: "Digite a capacidade do cômodo",
      addRoom: "Adicionar Cômodo",
      removeRoom: "Remover Cômodo",
      graph: "Grafo dos Cômodos",
      addGraph: "Adicionar Grafo",
      removeGraph: "Remover Grafo",
      // View Preset Page
      viewHousePreset: "Visualização de Presets",
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
      next: "Next",
      prev: "Previous",
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
      select: "Select",
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
      // Screen Guard
      mobileOnly: "Access to this site is not available for mobile devices.",
      mobileOnlyDesc: "Please use a device with a larger screen.",
      // Create Preset Page
      createHousePreset: "Create House Preset",
      rooms: "Rooms",
      presetName: "Preset Name",
      presetNamePlaceholder: "Enter the preset name",
      roomName: "Room Name",
      roomNamePlaceholder: "Enter the room name",
      room1: "Room 1",
      room2: "Room 2",
      distance: "Distance",
      distancePlaceholder: "Enter the distance",
      atuator: "Actuator",
      atuatorPlaceholder: "Select the actuator",
      atuators: "Actuators",
      atuatorsPlaceholder: "Select the actuators",
      roomCapacity: "Room Capacity",
      roomCapacityPlaceholder: "Enter the room capacity",
      addRoom: "Add Room",
      removeRoom: "Remove Room",
      addGraph: "Add Graph",
      removeGraph: "Remove Graph",
      graph: "Graph of Rooms",
      // View Preset Page
      viewHousePreset: "View Presets",
      
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false, // React already does escaping
  },
});

// Save the current language to localStorage whenever it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;