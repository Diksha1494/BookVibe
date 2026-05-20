const getBaseUrl = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  return backendUrl.replace(/\/+$/, "");
};

export default getBaseUrl;
