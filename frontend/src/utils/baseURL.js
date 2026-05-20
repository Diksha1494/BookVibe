const getBaseUrl = () => {
  // If running in production (Vite build), default to relative routing ("")
  // Otherwise, default to local backend ("http://localhost:5000")
  const defaultBackend = import.meta.env.PROD ? "" : "http://localhost:5000";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || defaultBackend;
  return backendUrl.replace(/\/+$/, "");
};

export default getBaseUrl;
