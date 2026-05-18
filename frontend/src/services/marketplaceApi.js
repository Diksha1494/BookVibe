import axios from "axios";
import getBaseUrl from "../utils/baseURL";

const apiClient = axios.create({
  baseURL: `${getBaseUrl()}/api`,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken") || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const extractData = (response) => response?.data ?? response;

export const marketplaceApi = {
  async createListing(payload) {
    const response = await apiClient.post("/books/marketplace", payload);
    return extractData(response);
  },

  async getMyListings() {
    const response = await apiClient.get("/books/marketplace/my-listings");
    return extractData(response);
  },

  async deleteMyListing(id) {
    const response = await apiClient.delete(`/books/marketplace/${id}`);
    return extractData(response);
  },

  async createBorrowRequest(bookId) {
    const response = await apiClient.post(`/borrow/${bookId}`);
    return extractData(response);
  },

  async getBorrowRequests() {
    const response = await apiClient.get("/borrow/my-requests");
    return extractData(response);
  },

  async getIncomingBorrowRequests() {
    const response = await apiClient.get("/borrow/incoming");
    return extractData(response);
  },

  async updateBorrowStatus(requestId, status) {
    const response = await apiClient.patch(`/borrow/${requestId}/status`, { status });
    return extractData(response);
  },

  async createExchangeRequest({ requestedBookId, offeredBookId }) {
    const response = await apiClient.post("/exchange", { requestedBookId, offeredBookId });
    return extractData(response);
  },

  async getExchangeRequests() {
    const response = await apiClient.get("/exchange/my-requests");
    return extractData(response);
  },

  async getIncomingExchangeRequests() {
    const response = await apiClient.get("/exchange/incoming");
    return extractData(response);
  },

  async updateExchangeStatus(requestId, status) {
    const response = await apiClient.patch(`/exchange/${requestId}/status`, { status });
    return extractData(response);
  },
};

export default marketplaceApi;
