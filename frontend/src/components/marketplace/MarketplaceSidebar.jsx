import { NavLink } from "react-router-dom";

const sidebarLinks = [
  { label: "Sell Your Book", to: "/sell-book" },
  { label: "My Listings", to: "/my-listings" },
  { label: "Borrow Requests", to: "/borrow-requests" },
  { label: "Exchange Requests", to: "/exchange-requests" },
];

const MarketplaceSidebar = () => {
  return (
    <aside className="marketplace-sidebar">
      <div className="marketplace-sidebar-card">
        <p className="marketplace-sidebar-eyebrow">Community Marketplace</p>
        <h2>Reader dashboard</h2>
        <nav className="marketplace-sidebar-nav">
          {sidebarLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `marketplace-sidebar-link ${isActive ? "marketplace-sidebar-link-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default MarketplaceSidebar;
