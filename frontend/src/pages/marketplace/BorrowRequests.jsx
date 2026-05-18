import MarketplaceDashboardShell from "../../components/marketplace/MarketplaceDashboardShell";
import RequestCard from "../../components/marketplace/RequestCard";
import useMarketplaceCollection from "../../hooks/useMarketplaceCollection";
import { getBorrowHistory, getBorrowRequests } from "../../utils/marketplaceStorage";
import { useAuth } from "../../context/AuthContext";

const BorrowRequests = () => {
  const auth = useAuth?.();
  const currentUser = auth?.currentUser || null;
  const { items: borrowRequests, loading } = useMarketplaceCollection(getBorrowRequests);
  const { items: borrowHistory } = useMarketplaceCollection(getBorrowHistory);

  const myEmail = currentUser?.email || "";
  const visibleRequests = borrowRequests.filter((request) => !myEmail || request?.requesterEmail === myEmail);
  const visibleHistory = borrowHistory.filter((request) => !myEmail || request?.requesterEmail === myEmail);

  return (
    <MarketplaceDashboardShell
      title="Borrow Requests"
      description="Track the requests you have sent to borrow books from the marketplace community."
    >
      {loading ? <div className="marketplace-empty-state">Loading requests...</div> : null}

      {!loading && visibleRequests.length ? (
        <div className="marketplace-stack">
          {visibleRequests.map((request) => (
            <RequestCard key={request?.id} request={request} type="borrow" />
          ))}
        </div>
      ) : null}

      {!loading && !visibleRequests.length ? (
        <div className="marketplace-empty-state">No borrow requests yet. Borrow-enabled books will appear here after you request them.</div>
      ) : null}

      <div className="marketplace-card" style={{ marginTop: "1rem" }}>
        <h2 className="text-xl font-semibold mb-4">Borrow History</h2>
        {visibleHistory.length ? (
          <div className="marketplace-stack">
            {visibleHistory.slice(0, 5).map((request) => (
              <RequestCard key={`history-${request?.id}`} request={request} type="borrow" />
            ))}
          </div>
        ) : (
          <div className="marketplace-empty-state">Your borrow history will show up here once requests are submitted.</div>
        )}
      </div>
    </MarketplaceDashboardShell>
  );
};

export default BorrowRequests;
