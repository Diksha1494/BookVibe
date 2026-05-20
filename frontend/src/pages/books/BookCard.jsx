import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion } from "framer-motion";
import "./Book.css";
import { getImgUrl } from "../../utils/getImgUrl";
import { addToCart, addToWishlist, removeFromWishlist } from "../../redux/features/cart/cartSlice";
import { useAuth } from "../../context/AuthContext";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.cart.wishlistItems);
  const auth = useAuth?.();
  const currentUser = auth?.currentUser || null;
  const isWishlisted = wishlistItems.some((item) => item._id === book?._id);

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

          <p className="book-price">
            ${book?.newPrice} <span className="old-price">$ {book?.oldPrice}</span>
          </p>

          <div className="book-actions">
            <button onClick={() => handleAddToCart(book)} className="btn-primary">
              <FiShoppingCart />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default BookCard;
