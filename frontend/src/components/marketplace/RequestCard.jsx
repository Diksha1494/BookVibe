import StatusBadge from "./StatusBadge";
import { getImgUrl } from "../../utils/getImgUrl";

const getUserName = (user, fallback = "Reader") => user?.username || user?.email?.split("@")[0] || fallback;

const RequestCard = ({ request, type = "borrow", actions = null }) => {
  const isExchange = type === "exchange";
  const book = isExchange ? request?.requestedBook : request?.book;
  const offeredBook = request?.offeredBook;
  const image = book?.coverImage ? getImgUrl(book.coverImage) : getImgUrl("book-1.png");
  const requestedTitle = book?.title || request?.bookTitle || "Untitled Book";
  const offeredTitle = offeredBook?.title || request?.offeredBookTitle || "My Book";
  const requesterName = getUserName(request?.requester || request?.borrower, request?.requesterName || "Reader");
  const ownerName = getUserName(request?.owner, request?.ownerName || "Community Seller");

  return (
    <article className="request-card">
      <div className="request-card-header">
        <div className="request-card-heading">
          <img src={image} alt={requestedTitle} className="request-card-image" />
          <div>
          <p className="request-card-label">{isExchange ? "Exchange Request" : "Borrow Request"}</p>
          <h3 className="request-card-title">{requestedTitle}</h3>
          </div>
        </div>
        <StatusBadge status={request?.status || "pending"} />
      </div>

      <div className="request-card-grid">
        <div>
          <span className="request-card-key">Requester</span>
          <p>{requesterName}</p>
        </div>
        <div>
          <span className="request-card-key">Owner</span>
          <p>{ownerName}</p>
        </div>
        <div>
          <span className="request-card-key">Created</span>
          <p>{request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : "Today"}</p>
        </div>
        <div>
          <span className="request-card-key">{isExchange ? "Offered Book" : "Duration"}</span>
          <p>{isExchange ? offeredTitle : "Pending owner approval"}</p>
        </div>
      </div>
      {actions ? <div className="request-card-actions">{actions}</div> : null}
    </article>
  );
};

export default RequestCard;
