import "./../../styles/marketplace.css";
import MarketplaceSidebar from "./MarketplaceSidebar";

const MarketplaceDashboardShell = ({ title, description, action, children }) => {
  return (
    <section className="marketplace-dashboard-shell">
      <div className="marketplace-dashboard-layout">
        <MarketplaceSidebar />
        <div className="marketplace-dashboard-content">
          <div className="marketplace-section-header">
            <div>
              <p className="marketplace-section-eyebrow">Marketplace</p>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            {action ? <div className="marketplace-section-action">{action}</div> : null}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
};

export default MarketplaceDashboardShell;
