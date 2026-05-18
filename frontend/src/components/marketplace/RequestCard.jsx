import StatusBadge from "./StatusBadge";

const RequestCard = ({ request, type = "borrow" }) => {
  const isExchange = type === "exchange";

  return (
    <article className="request-card">
      <div className="request-card-header">
        <div>
          <p className="request-card-label">{isExchange ? "Exchange Request" : "Borrow Request"}</p>
          <h3 className="request-card-title">{request?.bookTitle || "Untitled Book"}</h3>
        </div>
        <StatusBadge status={request?.status || "pending"} />
      </div>

      <div className="request-card-grid">
        <div>
          <span className="request-card-key">Requester</span>
          <p>{request?.requesterName || "Reader"}</p>
        </div>
        <div>
          <span className="request-card-key">Owner</span>
          <p>{request?.ownerName || "Community Seller"}</p>
        </div>
        <div>
          <span className="request-card-key">Created</span>
          <p>{request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : "Today"}</p>
        </div>
        <div>
          <span className="request-card-key">{isExchange ? "Offered Book" : "Duration"}</span>
          <p>{isExchange ? request?.offeredBookTitle || "My Book" : `${request?.duration || 7} days`}</p>
        </div>
      </div>
    </article>
  );
};

export default RequestCard;
