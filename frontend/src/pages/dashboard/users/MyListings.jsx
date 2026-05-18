import React from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useDeleteUserListingMutation, useFetchMyListingsQuery } from "../../../redux/features/books/booksApi";
import { getImgUrl } from "../../../utils/getImgUrl";
import MarketplaceDashboardShell from "../../../components/marketplace/MarketplaceDashboardShell";
import BookBadge from "../../../components/marketplace/BookBadge";
import StatusBadge from "../../../components/marketplace/StatusBadge";

const MyListings = () => {
  const { data, isLoading, isError, refetch } = useFetchMyListingsQuery();
  const [deleteUserListing] = useDeleteUserListingMutation();
  const listings = data?.books || [];

  const handleDeleteListing = async (id) => {
    try {
      await deleteUserListing(id).unwrap();
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Listing deleted",
        showConfirmButton: false,
        timer: 1800,
      });
      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: error?.data?.message || "Failed to delete listing.",
      });
    }
  };

  if (isLoading) return <div className="books-page-state">Loading your listings...</div>;
  if (isError) return <div className="books-page-state">Failed to load your listings.</div>;

  return (
    <MarketplaceDashboardShell
      title="My Listings"
      description="Edit, remove, and monitor the books you have listed in the community marketplace."
      action={
        <Link to="/sell-book" className="marketplace-btn marketplace-btn-primary">
          Sell another
        </Link>
      }
    >
      {listings.length ? (
        <div className="listing-grid">
          {listings.map((book) => (
            <article key={book._id} className="listing-card">
              <img src={getImgUrl(book.coverImage)} alt={book.title} className="listing-card-image" />
              <div className="listing-card-body">
                <div className="book-card-badges" style={{ marginBottom: "0.75rem" }}>
                  <BookBadge mode={book.listingMode} />
                  <StatusBadge status={book.availabilityStatus} />
                </div>
                <h3 className="font-semibold mb-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author || "Community seller"}</p>
                <p className="text-sm text-gray-600 mb-3">
                  {book.description?.length > 110 ? `${book.description.slice(0, 110)}...` : book.description}
                </p>
                <p className="font-semibold">${book.newPrice}</p>
                <div className="listing-card-actions">
                  <Link to={`/my-listings/edit/${book._id}`} className="marketplace-btn marketplace-btn-secondary">
                    Edit
                  </Link>
                  <button onClick={() => handleDeleteListing(book._id)} className="marketplace-btn marketplace-btn-primary">
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="marketplace-empty-state">You have not created any listings yet.</div>
      )}
    </MarketplaceDashboardShell>
  );
};

export default MyListings;
