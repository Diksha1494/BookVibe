import { useEffect, useState } from "react";
import MarketplaceDashboardShell from "../../components/marketplace/MarketplaceDashboardShell";
import RequestCard from "../../components/marketplace/RequestCard";
import marketplaceApi from "../../services/marketplaceApi";

const ExchangeRequests = () => {
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await marketplaceApi.getExchangeRequests();
        setExchangeRequests(data?.requests || []);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <MarketplaceDashboardShell
      title="Exchange Requests"
      description="Review the exchange offers you have sent and their current approval status."
    >
      {loading ? (
        <div className="marketplace-stack">
          <div className="request-card request-card-skeleton" />
          <div className="request-card request-card-skeleton" />
        </div>
      ) : null}

      {!loading && exchangeRequests.length ? (
        <div className="marketplace-stack">
          {exchangeRequests.map((request) => (
            <RequestCard key={request?._id} request={request} type="exchange" />
          ))}
        </div>
      ) : null}

      {!loading && !exchangeRequests.length ? (
        <div className="marketplace-empty-state">No exchange requests yet. Send one from an exchange-enabled marketplace book.</div>
      ) : null}
    </MarketplaceDashboardShell>
  );
};

export default ExchangeRequests;
