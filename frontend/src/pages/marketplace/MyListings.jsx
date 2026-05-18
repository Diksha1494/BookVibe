import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MarketplaceDashboardShell from "../../components/marketplace/MarketplaceDashboardShell";
import BookBadge from "../../components/marketplace/BookBadge";
import StatusBadge from "../../components/marketplace/StatusBadge";
import useMarketplaceCollection from "../../hooks/useMarketplaceCollection";
import { getMarketplaceListings, removeMarketplaceListing } from "../../utils/marketplaceStorage";
import { getImgUrl } from "../../utils/getImgUrl";

const MyListings = () => {
  const auth = useAuth?.();
  const currentUser = auth?.currentUser || null;
  const { items: listings, loading, refresh } = useMarketplaceCollection(getMarketplaceListings);

  const myEmail = currentUser?.email || "";
  const visibleListings = listings.filter((listing) => !myEmail || listing?.ownerEmail === myEmail);

  const handleDelete = async (id) => {
    removeMarketplaceListing(id);
    refresh();
    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Listing removed",
      showConfirmButton: false,
      timer: 1800,
    });
  };

  return (
    <MarketplaceDashboardShell
      title="My Listings"
      description="Manage the books you have added to the marketplace dashboard without changing the main store inventory flow."
      action={
        <Link to="/sell-book" className="marketplace-btn marketplace-btn-primary">
          Add Listing
        </Link>
      }
    >
      {loading ? <div className="marketplace-empty-state">Loading your listings...</div> : null}

      {!loading && visibleListings.length ? (
        <div className="listing-grid">
          {visibleListings.map((listing) => (
            <article key={listing?._id} className="listing-card">
              <img
                src={listing?.coverImage ? listing.coverImage : getImgUrl("book-1.png")}
                alt={listing?.title}
                className="listing-card-image"
              />
              <div className="listing-card-body">
                <div className="book-card-badges" style={{ marginBottom: "0.75rem" }}>
                  <BookBadge mode={listing?.listingMode} />
                  <StatusBadge status={listing?.availabilityStatus} />
                </div>
                <h3 className="font-semibold mb-2">{listing?.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{listing?.author}</p>
                <p className="text-sm text-gray-600 mb-3">
                  {listing?.description?.length > 110 ? `${listing.description.slice(0, 110)}...` : listing?.description}
                </p>
                <p className="font-semibold">${Number(listing?.newPrice || 0).toFixed(2)}</p>
                <div className="listing-card-actions">
                  <button type="button" className="marketplace-btn marketplace-btn-secondary" onClick={() => handleDelete(listing?._id)}>
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {!loading && !visibleListings.length ? (
        <div className="marketplace-empty-state">You have not added any marketplace listings yet.</div>
      ) : null}
    </MarketplaceDashboardShell>
  );
};

export default MyListings;
