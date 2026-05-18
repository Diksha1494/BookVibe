const modeClasses = {
  sell: "book-badge book-badge-sell",
  borrow: "book-badge book-badge-borrow",
  exchange: "book-badge book-badge-exchange",
};

const formatLabel = (value) => {
  if (!value) return "Sell";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const BookBadge = ({ mode }) => {
  const normalizedMode = String(mode || "sell").toLowerCase();

  return <span className={modeClasses[normalizedMode] || modeClasses.sell}>{formatLabel(normalizedMode)}</span>;
};

export default BookBadge;
