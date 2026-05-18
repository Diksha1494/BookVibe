const statusClasses = {
  available: "status-badge status-badge-available",
  borrowed: "status-badge status-badge-borrowed",
  exchanged: "status-badge status-badge-exchanged",
  sold: "status-badge status-badge-sold",
  reserved: "status-badge status-badge-reserved",
  inactive: "status-badge status-badge-inactive",
  pending: "status-badge status-badge-pending",
  approved: "status-badge status-badge-approved",
  rejected: "status-badge status-badge-rejected",
};

const formatLabel = (value) => {
  if (!value) return "Available";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = String(status || "available").toLowerCase();

  return (
    <span className={statusClasses[normalizedStatus] || statusClasses.available}>
      {formatLabel(normalizedStatus)}
    </span>
  );
};

export default StatusBadge;
