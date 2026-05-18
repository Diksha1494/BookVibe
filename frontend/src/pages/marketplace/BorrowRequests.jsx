import { useEffect, useState } from "react";
import MarketplaceDashboardShell from "../../components/marketplace/MarketplaceDashboardShell";
import RequestCard from "../../components/marketplace/RequestCard";
import marketplaceApi from "../../services/marketplaceApi";

const BorrowRequests = () => {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await marketplaceApi.getBorrowRequests();
        setBorrowRequests(data?.requests || []);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <MarketplaceDashboardShell
      title="Borrow Requests"
      description="Track the books you have asked to borrow from the BookVibe marketplace."
    >
      {loading ? (
        <div className="marketplace-stack">
          <div className="request-card request-card-skeleton" />
          <div className="request-card request-card-skeleton" />
        </div>
      ) : null}

      {!loading && borrowRequests.length ? (
        <div className="marketplace-stack">
          {borrowRequests.map((request) => (
            <RequestCard key={request?._id} request={request} type="borrow" />
          ))}
        </div>
      ) : null}

      {!loading && !borrowRequests.length ? (
        <div className="marketplace-empty-state">No borrow requests yet. Use the Borrow button on marketplace books to start one.</div>
      ) : null}
    </MarketplaceDashboardShell>
  );
};

export default BorrowRequests;
