
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
    withCredentials: true,  // ✅ send cookies for session / auth

});

export default api;
