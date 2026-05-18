import MarketplaceDashboardShell from "../../components/marketplace/MarketplaceDashboardShell";
import RequestCard from "../../components/marketplace/RequestCard";
import useMarketplaceCollection from "../../hooks/useMarketplaceCollection";
import { getExchangeRequests } from "../../utils/marketplaceStorage";
import { useAuth } from "../../context/AuthContext";

const ExchangeRequests = () => {
  const auth = useAuth?.();
  const currentUser = auth?.currentUser || null;
  const { items: exchangeRequests, loading } = useMarketplaceCollection(getExchangeRequests);

  const myEmail = currentUser?.email || "";
  const visibleRequests = exchangeRequests.filter((request) => !myEmail || request?.requesterEmail === myEmail);

  return (
    <MarketplaceDashboardShell
      title="Exchange Requests"
      description="Review the exchange offers you have already sent from your marketplace listings."
    >
      {loading ? <div className="marketplace-empty-state">Loading requests...</div> : null}

      {!loading && visibleRequests.length ? (
        <div className="marketplace-stack">
          {visibleRequests.map((request) => (
            <RequestCard key={request?.id} request={request} type="exchange" />
          ))}
        </div>
      ) : null}

      {!loading && !visibleRequests.length ? (
        <div className="marketplace-empty-state">No exchange requests yet. Send one from any exchange-enabled listing.</div>
      ) : null}
    </MarketplaceDashboardShell>
  );
};

export default ExchangeRequests;
