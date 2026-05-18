import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "./AuthContext";
import marketplaceApi from "../services/marketplaceApi";

const MarketplaceContext = createContext(null);

const BORROW_KEY = "marketplaceBorrowRequests";
const EXCHANGE_KEY = "marketplaceExchangeRequests";
const HISTORY_KEY = "marketplaceBorrowHistory";

const popupBase = {
  customClass: {
    popup: "shop-alert-popup",
    title: "shop-alert-title",
    htmlContainer: "shop-alert-text",
    confirmButton: "shop-alert-confirm",
    cancelButton: "shop-alert-cancel",
  },
  buttonsStyling: false,
};

const showToast = (title, icon = "success") =>
  Swal.fire({
    ...popupBase,
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });

const safeRead = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.warn("[MARKETPLACE] Failed to read local collection", {
      key,
      message: error.message,
    });
    return [];
  }
};

const persist = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const normalizeBorrowRequest = (payload) => ({
  id: payload.id || `borrow-${Date.now()}`,
  type: "borrow",
  status: payload.status || "pending",
  createdAt: payload.createdAt || new Date().toISOString(),
  duration: payload.duration,
  bookId: payload.bookId,
  bookTitle: payload.bookTitle,
  bookImage: payload.bookImage,
  ownerName: payload.ownerName,
  requesterName: payload.requesterName,
  requesterEmail: payload.requesterEmail,
});

const normalizeExchangeRequest = (payload) => ({
  id: payload.id || `exchange-${Date.now()}`,
  type: "exchange",
  status: payload.status || "pending",
  createdAt: payload.createdAt || new Date().toISOString(),
  bookId: payload.bookId,
  bookTitle: payload.bookTitle,
  bookImage: payload.bookImage,
  ownerName: payload.ownerName,
  requesterName: payload.requesterName,
  requesterEmail: payload.requesterEmail,
  offeredBookId: payload.offeredBookId,
  offeredBookTitle: payload.offeredBookTitle,
});

export const useMarketplace = () => useContext(MarketplaceContext);

export const MarketplaceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingBorrow, setSubmittingBorrow] = useState(false);
  const [submittingExchange, setSubmittingExchange] = useState(false);

  useEffect(() => {
    setBorrowRequests(safeRead(BORROW_KEY));
    setExchangeRequests(safeRead(EXCHANGE_KEY));
    setBorrowHistory(safeRead(HISTORY_KEY));
    setLoading(false);
  }, []);

  useEffect(() => {
    persist(BORROW_KEY, borrowRequests);
  }, [borrowRequests]);

  useEffect(() => {
    persist(EXCHANGE_KEY, exchangeRequests);
  }, [exchangeRequests]);

  useEffect(() => {
    persist(HISTORY_KEY, borrowHistory);
  }, [borrowHistory]);

  const submitBorrowRequest = useCallback(async ({ book, duration }) => {
    if (!currentUser) {
      throw new Error("Please log in to request a borrow.");
    }

    const payload = normalizeBorrowRequest({
      duration,
      bookId: book?._id,
      bookTitle: book?.title,
      bookImage: book?.coverImage,
      ownerName: book?.owner?.username || "Community Seller",
      requesterName:
        currentUser?.username || currentUser?.displayName || currentUser?.email?.split("@")[0] || "Reader",
      requesterEmail: currentUser?.email,
    });

    setSubmittingBorrow(true);

    try {
      const response = await marketplaceApi.createBorrowRequest(payload);
      const savedRequest = normalizeBorrowRequest(response?.request || payload);
      setBorrowRequests((prev) => [savedRequest, ...prev]);
      setBorrowHistory((prev) => [savedRequest, ...prev]);
      showToast("Borrow request sent");
      return savedRequest;
    } catch (error) {
      console.warn("[MARKETPLACE] Borrow API failed, falling back to local state", {
        message: error?.response?.data?.message || error.message,
      });
      setBorrowRequests((prev) => [payload, ...prev]);
      setBorrowHistory((prev) => [payload, ...prev]);
      showToast("Borrow request saved locally", "info");
      return payload;
    } finally {
      setSubmittingBorrow(false);
    }
  }, [currentUser]);

  const submitExchangeRequest = useCallback(async ({ book, offeredBook }) => {
    if (!currentUser) {
      throw new Error("Please log in to send an exchange request.");
    }

    const payload = normalizeExchangeRequest({
      bookId: book?._id,
      bookTitle: book?.title,
      bookImage: book?.coverImage,
      ownerName: book?.owner?.username || "Community Seller",
      requesterName:
        currentUser?.username || currentUser?.displayName || currentUser?.email?.split("@")[0] || "Reader",
      requesterEmail: currentUser?.email,
      offeredBookId: offeredBook?._id,
      offeredBookTitle: offeredBook?.title,
    });

    setSubmittingExchange(true);

    try {
      const response = await marketplaceApi.createExchangeRequest(payload);
      const savedRequest = normalizeExchangeRequest(response?.request || payload);
      setExchangeRequests((prev) => [savedRequest, ...prev]);
      showToast("Exchange request sent");
      return savedRequest;
    } catch (error) {
      console.warn("[MARKETPLACE] Exchange API failed, falling back to local state", {
        message: error?.response?.data?.message || error.message,
      });
      setExchangeRequests((prev) => [payload, ...prev]);
      showToast("Exchange request saved locally", "info");
      return payload;
    } finally {
      setSubmittingExchange(false);
    }
  }, [currentUser]);

  const value = useMemo(
    () => ({
      borrowRequests,
      exchangeRequests,
      borrowHistory,
      loading,
      submittingBorrow,
      submittingExchange,
      submitBorrowRequest,
      submitExchangeRequest,
    }),
    [
      borrowRequests,
      exchangeRequests,
      borrowHistory,
      loading,
      submittingBorrow,
      submittingExchange,
      submitBorrowRequest,
      submitExchangeRequest,
    ]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
};
