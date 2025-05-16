import axios from "axios";
const { VITE_BACKEND_DEV, VITE_BACKEND_PROD, VITE_ENV } = import.meta.env;

const api = axios.create({
  baseURL: VITE_ENV == "DEV" ? VITE_BACKEND_DEV : VITE_BACKEND_PROD
});


export default api;