import axios from "axios";

const rawApiUrl =
  (process.env.REACT_APP_API_URL || "").trim() ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://productivity-backend-8i37.onrender.com");

const apiBaseUrl = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, "")}/api`;

const API = axios.create({
  baseURL: apiBaseUrl,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const getAssetUrl = (assetPath = "") => {
  if (!assetPath) return "";

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const origin = apiBaseUrl.replace(/\/api$/, "");
  return `${origin}/${assetPath.replace(/^\/+/, "")}`;
};

export default API;
