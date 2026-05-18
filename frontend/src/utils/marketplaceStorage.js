const LISTINGS_KEY = "bookvibe_marketplace_listings";
const BORROW_REQUESTS_KEY = "bookvibe_marketplace_borrow_requests";
const EXCHANGE_REQUESTS_KEY = "bookvibe_marketplace_exchange_requests";
const BORROW_HISTORY_KEY = "bookvibe_marketplace_borrow_history";

const readCollection = (key) => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : [];
  } catch (error) {
    console.warn("[MARKETPLACE_STORAGE] Failed to read collection", {
      key,
      message: error.message,
    });
    return [];
  }
};

const writeCollection = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const getMarketplaceListings = () => readCollection(LISTINGS_KEY);
export const getBorrowRequests = () => readCollection(BORROW_REQUESTS_KEY);
export const getExchangeRequests = () => readCollection(EXCHANGE_REQUESTS_KEY);
export const getBorrowHistory = () => readCollection(BORROW_HISTORY_KEY);

export const addMarketplaceListing = (listing) => {
  const nextListing = {
    _id: listing?._id || createId("listing"),
    title: listing?.title || "Untitled Book",
    author: listing?.author || "Unknown Author",
    description: listing?.description || "",
    condition: listing?.condition || "good",
    newPrice: Number(listing?.newPrice || listing?.price || 0),
    oldPrice: Number(listing?.oldPrice || listing?.price || 0),
    listingMode: listing?.listingMode || "sell",
    availabilityStatus: listing?.availabilityStatus || "available",
    coverImage: listing?.coverImage || "",
    ownerEmail: listing?.ownerEmail || "",
    ownerName: listing?.ownerName || "Community Seller",
    createdAt: listing?.createdAt || new Date().toISOString(),
    source: "marketplace-local",
  };

  const currentListings = getMarketplaceListings();
  const nextListings = [nextListing, ...currentListings];
  writeCollection(LISTINGS_KEY, nextListings);
  return nextListing;
};

export const updateMarketplaceListing = (id, updates) => {
  const currentListings = getMarketplaceListings();
  const nextListings = currentListings.map((listing) =>
    listing._id === id ? { ...listing, ...updates } : listing
  );

  writeCollection(LISTINGS_KEY, nextListings);
  return nextListings.find((listing) => listing._id === id) || null;
};

export const removeMarketplaceListing = (id) => {
  const currentListings = getMarketplaceListings();
  const nextListings = currentListings.filter((listing) => listing._id !== id);
  writeCollection(LISTINGS_KEY, nextListings);
  return nextListings;
};

export const createBorrowRequest = (request) => {
  const nextRequest = {
    id: request?.id || createId("borrow"),
    bookId: request?.bookId || "",
    bookTitle: request?.bookTitle || "Untitled Book",
    ownerName: request?.ownerName || "Community Seller",
    requesterName: request?.requesterName || "Reader",
    requesterEmail: request?.requesterEmail || "",
    duration: Number(request?.duration || 7),
    createdAt: request?.createdAt || new Date().toISOString(),
    status: request?.status || "pending",
    type: "borrow",
  };

  const borrowRequests = [nextRequest, ...getBorrowRequests()];
  const borrowHistory = [nextRequest, ...getBorrowHistory()];
  writeCollection(BORROW_REQUESTS_KEY, borrowRequests);
  writeCollection(BORROW_HISTORY_KEY, borrowHistory);
  return nextRequest;
};

export const createExchangeRequest = (request) => {
  const nextRequest = {
    id: request?.id || createId("exchange"),
    bookId: request?.bookId || "",
    bookTitle: request?.bookTitle || "Untitled Book",
    ownerName: request?.ownerName || "Community Seller",
    requesterName: request?.requesterName || "Reader",
    requesterEmail: request?.requesterEmail || "",
    offeredBookId: request?.offeredBookId || "",
    offeredBookTitle: request?.offeredBookTitle || "My Book",
    createdAt: request?.createdAt || new Date().toISOString(),
    status: request?.status || "pending",
    type: "exchange",
  };

  const exchangeRequests = [nextRequest, ...getExchangeRequests()];
  writeCollection(EXCHANGE_REQUESTS_KEY, exchangeRequests);
  return nextRequest;
};
