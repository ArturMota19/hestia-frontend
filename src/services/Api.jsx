import axios from "axios";
const { VITE_BACKEND } = import.meta.env;

const api = axios.create({
  baseURL: VITE_BACKEND
});


export default api;