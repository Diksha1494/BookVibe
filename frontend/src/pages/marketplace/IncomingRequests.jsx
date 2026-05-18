import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import MarketplaceDashboardShell from "../../components/marketplace/MarketplaceDashboardShell";
import RequestCard from "../../components/marketplace/RequestCard";
import marketplaceApi from "../../services/marketplaceApi";

const IncomingRequests = () => {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const allRequests = useMemo(
    () => [
      ...borrowRequests.map((request) => ({ ...request, requestType: "borrow" })),
      ...exchangeRequests.map((request) => ({ ...request, requestType: "exchange" })),
    ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    [borrowRequests, exchangeRequests]
  );

  const fetchIncoming = async () => {
    setLoading(true);
    try {
      const [borrowData, exchangeData] = await Promise.all([
        marketplaceApi.getIncomingBorrowRequests(),
        marketplaceApi.getIncomingExchangeRequests(),
      ]);
      setBorrowRequests(borrowData?.requests || []);
      setExchangeRequests(exchangeData?.requests || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncoming();
  }, []);

  const updateLocalRequest = (updatedRequest, type) => {
    const setter = type === "borrow" ? setBorrowRequests : setExchangeRequests;
    setter((prev) => prev.map((request) => (request?._id === updatedRequest?._id ? updatedRequest : request)));
  };

  const handleStatusChange = async (request, status) => {
    const actionLabel = status === "approved" ? "Approve" : "Reject";
    const result = await Swal.fire({
      title: `${actionLabel} request?`,
      text: status === "approved" ? "The requested book will become unavailable." : "The requester will see this request as rejected.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: actionLabel,
      confirmButtonColor: status === "approved" ? "#4f46e5" : "#dc2626",
    });

    if (!result.isConfirmed) return;

    setUpdatingId(request._id);
    const previousBorrow = borrowRequests;
    const previousExchange = exchangeRequests;

    updateLocalRequest({ ...request, status }, request.requestType);

    try {
      const data =
        request.requestType === "borrow"
          ? await marketplaceApi.updateBorrowStatus(request._id, status)
          : await marketplaceApi.updateExchangeStatus(request._id, status);

      updateLocalRequest(data?.request, request.requestType);

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Request ${status}`,
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (error) {
      setBorrowRequests(previousBorrow);
      setExchangeRequests(previousExchange);
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error?.response?.data?.message || "Unable to update request",
        showConfirmButton: false,
        timer: 2200,
      });
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <MarketplaceDashboardShell
      title="Incoming Requests"
      description="Approve or reject borrow and exchange requests for books you own."
    >
      {loading ? (
        <div className="marketplace-stack">
          <div className="request-card request-card-skeleton" />
          <div className="request-card request-card-skeleton" />
        </div>
      ) : null}

      {!loading && allRequests.length ? (
        <div className="marketplace-stack">
          {allRequests.map((request) => (
            <RequestCard
              key={`${request.requestType}-${request._id}`}
              request={request}
              type={request.requestType}
              actions={
                request.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      className="marketplace-btn marketplace-btn-primary"
                      disabled={updatingId === request._id}
                      onClick={() => handleStatusChange(request, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="marketplace-btn marketplace-btn-danger"
                      disabled={updatingId === request._id}
                      onClick={() => handleStatusChange(request, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : null
              }
            />
          ))}
        </div>
      ) : null}

      {!loading && !allRequests.length ? (
        <div className="marketplace-empty-state">No incoming requests yet. New borrower and exchange offers will appear here.</div>
      ) : null}
    </MarketplaceDashboardShell>
  );
};

export default IncomingRequests;
