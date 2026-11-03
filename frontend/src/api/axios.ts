// // src/api/axios.ts
// import axios from "axios";

// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();



// const instance = axios.create({
//   baseURL: apiBaseUrl || undefined,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
console.log("Resolved apiBaseUrl:", apiBaseUrl);

const instance = axios.create({
  baseURL: apiBaseUrl || undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("Axios baseURL:", instance.defaults.baseURL);

// Attach JWT token...

// Attach JWT token to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // MUST match AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
