import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion } from "framer-motion";
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
import marketplaceApi from "../../services/marketplaceApi";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.cart.wishlistItems);
  const auth = useAuth?.();
  const currentUser = auth?.currentUser || null;
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [myBooks, setMyBooks] = useState([]);
  const [borrowRequested, setBorrowRequested] = useState(false);
  const [exchangeRequested, setExchangeRequested] = useState(false);
  const isWishlisted = wishlistItems.some((item) => item._id === book?._id);

  const mode = String(book?.listingMode || book?.mode || "sell").toLowerCase();
  const status = String(book?.availabilityStatus || book?.status || "available").toLowerCase();
  const ownerId = book?.owner?._id || book?.owner;
  const isOwnBook = currentUser?.id && ownerId && String(currentUser.id) === String(ownerId);
  const canBorrow = mode === "borrow" && status === "available" && !isOwnBook && !borrowRequested;
  const canExchange = mode === "exchange" && status === "available" && !isOwnBook && !exchangeRequested;

  const exchangeChoices = useMemo(
    () => myBooks.filter((listing) => listing?._id !== book?._id && listing?.availabilityStatus === "available"),
    [book?._id, myBooks]
  );

  const loadMyBooks = useCallback(async () => {
    if (!currentUser) return;

    try {
      const data = await marketplaceApi.getMyListings();
      setMyBooks(data?.books || []);
    } catch {
      setMyBooks([]);
    }
  }, [currentUser]);

  useEffect(() => {
    loadMyBooks();
  }, [loadMyBooks]);

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

  const handleBorrowRequest = async () => {
    if (!currentUser) {
      promptLogin();
      return;
    }

    if (isOwnBook) {
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "You cannot borrow your own book",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    setRequestLoading(true);
    setBorrowRequested(true);

    try {
      await marketplaceApi.createBorrowRequest(book?._id);

      setBorrowOpen(false);
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Borrow request sent",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      setBorrowRequested(false);
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error?.response?.data?.message || "Unable to send borrow request",
        showConfirmButton: false,
        timer: 2200,
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
    setExchangeRequested(true);

    try {
      await marketplaceApi.createExchangeRequest({
        requestedBookId: book?._id,
        offeredBookId: selectedBook?._id,
      });

      setExchangeOpen(false);
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Exchange request sent",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      setExchangeRequested(false);
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error?.response?.data?.message || "Unable to send exchange request",
        showConfirmButton: false,
        timer: 2200,
      });
    } finally {
      setRequestLoading(false);
    }
  };

  if (!book) return null;

  return (
    <Motion.div className="book-card" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
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
                <span>{borrowRequested ? "Request Sent" : isOwnBook ? "Your Book" : "Borrow"}</span>
              </button>
            )}

            {mode === "exchange" && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (!currentUser) {
                    promptLogin();
                    return;
                  }
                  loadMyBooks();
                  setExchangeOpen(true);
                }}
                disabled={currentUser ? !canExchange || !exchangeChoices.length : false}
              >
                <span>{exchangeRequested ? "Request Sent" : isOwnBook ? "Your Book" : "Exchange"}</span>
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
        myBooks={exchangeChoices}
        bookTitle={book?.title}
        loading={requestLoading}
      />
    </Motion.div>
  );
};

export default BookCard;
