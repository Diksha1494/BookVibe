import React, { useMemo, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "./Book.css";
import "../../styles/marketplace.css";
import { getImgUrl } from "../../utils/getImgUrl";
import { addToCart, addToWishlist, removeFromWishlist } from "../../redux/features/cart/cartSlice";
import { useAuth } from "../../context/AuthContext";
import BookBadge from "../../components/marketplace/BookBadge";
import StatusBadge from "../../components/marketplace/StatusBadge";
import BorrowModal from "../../components/marketplace/BorrowModal";
import ExchangeModal from "../../components/marketplace/ExchangeModal";
import useMarketplaceCollection from "../../hooks/useMarketplaceCollection";
import {
  createBorrowRequest,
  createExchangeRequest,
  getMarketplaceListings,
  updateMarketplaceListing,
} from "../../utils/marketplaceStorage";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.cart.wishlistItems);
  const auth = useAuth?.();
  const currentUser = auth?.currentUser || null;
  const { items: localListings } = useMarketplaceCollection(getMarketplaceListings);
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const isWishlisted = wishlistItems.some((item) => item._id === book?._id);

  const mode = String(book?.listingMode || book?.mode || "sell").toLowerCase();
  const status = String(book?.availabilityStatus || book?.status || "available").toLowerCase();
  const canBuy = mode === "sell" && status === "available";
  const canBorrow = mode === "borrow" && status === "available";
  const canExchange = mode === "exchange" && status === "available";

  const myBooks = useMemo(() => {
    const email = currentUser?.email || "";
    return localListings.filter((listing) => listing?.ownerEmail === email && listing?._id !== book?._id);
  }, [book?._id, currentUser?.email, localListings]);

  const handleAddToCart = (product) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    dispatch(addToCart(product));
  };

  const handleWishlistToggle = (product) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(product));
      return;
    }
    dispatch(addToWishlist(product));
  };

  const promptLogin = () => {
    navigate("/login");
  };

  const handleBorrowRequest = async (duration) => {
    if (!currentUser) {
      promptLogin();
      return;
    }

    setRequestLoading(true);

    try {
      createBorrowRequest({
        bookId: book?._id,
        bookTitle: book?.title,
        ownerName: book?.owner?.username || book?.ownerName || "Community Seller",
        requesterName: currentUser?.displayName || currentUser?.email?.split("@")[0] || "Reader",
        requesterEmail: currentUser?.email || "",
        duration,
      });

      if (book?.source === "marketplace-local") {
        updateMarketplaceListing(book?._id, { availabilityStatus: "borrowed" });
      }

      setBorrowOpen(false);
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Borrow request sent",
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setRequestLoading(false);
    }
  };

  const handleExchangeRequest = async (selectedBook) => {
    if (!currentUser) {
      promptLogin();
      return;
    }

    setRequestLoading(true);

    try {
      createExchangeRequest({
        bookId: book?._id,
        bookTitle: book?.title,
        ownerName: book?.owner?.username || book?.ownerName || "Community Seller",
        requesterName: currentUser?.displayName || currentUser?.email?.split("@")[0] || "Reader",
        requesterEmail: currentUser?.email || "",
        offeredBookId: selectedBook?._id,
        offeredBookTitle: selectedBook?.title,
      });

      if (book?.source === "marketplace-local") {
        updateMarketplaceListing(book?._id, { availabilityStatus: "exchanged" });
      }

      setExchangeOpen(false);
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Exchange request sent",
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setRequestLoading(false);
    }
  };

  if (!book) return null;

  return (
    <motion.div className="book-card" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
      <div className="book-card-content">
        <div className="book-media">
          <div className="book-image-wrapper">
            <Link to={`/books/${book?._id}`}>
              <img src={`${getImgUrl(book?.coverImage)}`} alt="" className="book-image" />
            </Link>
          </div>
          <button
            onClick={() => handleWishlistToggle(book)}
            className={`wishlist-inline-toggle ${isWishlisted ? "wishlist-inline-toggle-active" : ""}`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? <HiHeart /> : <HiOutlineHeart />}
          </button>
        </div>

        <div className="book-info">
          <Link to={`/books/${book?._id}`} style={{ textDecoration: "none" }}>
            <h3 className="book-title">{book?.title}</h3>
          </Link>
          <p className="book-description">
            {book?.description?.length > 80 ? `${book.description.slice(0, 80)}...` : book?.description}
          </p>

          <div className="book-card-badges">
            <BookBadge mode={mode} />
            <StatusBadge status={status} />
          </div>

          <p className="book-price">
            ${book?.newPrice} <span className="old-price">$ {book?.oldPrice}</span>
          </p>

          <div className="book-actions">
            {(mode === "sell" || !book?.listingMode) && (
              <button onClick={() => handleAddToCart(book)} className="btn-primary" disabled={status !== "available"}>
                <FiShoppingCart />
                <span>Add to Cart</span>
              </button>
            )}

            {mode === "borrow" && (
              <button type="button" className="btn-secondary" onClick={() => (currentUser ? setBorrowOpen(true) : promptLogin())} disabled={!canBorrow}>
                <span>Borrow Request</span>
              </button>
            )}

            {mode === "exchange" && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => (currentUser ? setExchangeOpen(true) : promptLogin())}
                disabled={!canExchange || !myBooks.length}
              >
                <span>Exchange Request</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <BorrowModal
        isOpen={borrowOpen}
        onClose={() => setBorrowOpen(false)}
        onConfirm={handleBorrowRequest}
        bookTitle={book?.title}
        loading={requestLoading}
      />

      <ExchangeModal
        isOpen={exchangeOpen}
        onClose={() => setExchangeOpen(false)}
        onConfirm={handleExchangeRequest}
        myBooks={myBooks}
        bookTitle={book?.title}
        loading={requestLoading}
      />
    </motion.div>
  );
};

export default BookCard;
