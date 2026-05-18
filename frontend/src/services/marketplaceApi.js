import axios from "axios";
import getBaseUrl from "../utils/baseURL";

const marketplaceClient = axios.create({
  baseURL: `${getBaseUrl()}/api/marketplace`,
  withCredentials: true,
});

marketplaceClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken") || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const extractData = (response) => response?.data ?? response;

export const marketplaceApi = {
  async getBorrowRequests() {
    const response = await marketplaceClient.get("/borrow-requests");
    return extractData(response);
  },

  async createBorrowRequest(payload) {
    const response = await marketplaceClient.post("/borrow-requests", payload);
    return extractData(response);
  },

  async getExchangeRequests() {
    const response = await marketplaceClient.get("/exchange-requests");
    return extractData(response);
  },

  async createExchangeRequest(payload) {
    const response = await marketplaceClient.post("/exchange-requests", payload);
    return extractData(response);
  },

  async getBorrowHistory() {
    const response = await marketplaceClient.get("/borrow-history");
    return extractData(response);
  },
};

export default marketplaceApi;
