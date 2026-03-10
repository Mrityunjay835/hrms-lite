import axios from "axios";

const api = axios.create({
  baseURL: "https://hrms-backend-eqx6.onrender.com",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;