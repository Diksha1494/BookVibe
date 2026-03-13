import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Cart.css';
import { getImgUrl } from '../../utils/getImgUrl';
import { addToCart, removeFromWishlist } from '../../redux/features/cart/cartSlice';

const WishlistPage = () => {
  const wishlistItems = useSelector(state => state.cart.wishlistItems);
  const dispatch = useDispatch();

  const handleRemoveFromWishlist = (product) => {
    dispatch(removeFromWishlist(product));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">Wishlist</h2>
      </div>

      <div className="cart-items">
        {wishlistItems.length > 0 ? (
          <ul className="item-list">
            {wishlistItems.map((product) => (
              <li key={product?._id} className="cart-item">
                <div className="item-image">
                  <img src={`${getImgUrl(product?.coverImage)}`} alt="Book" />
                </div>
                <div className="item-details">
                  <div className="item-header">
                    <h3 className="item-title">
                      <Link to={`/books/${product?._id}`}>{product?.title}</Link>
                    </h3>
                    <p className="item-price">{product?.newPrice}</p>
                  </div>
                  <p className="item-category"><strong>Category:</strong> {product?.category}</p>
                  <div className="item-footer">
                    <button onClick={() => handleAddToCart(product)} className="wishlist-move-btn">
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(product)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">No wishlist items found</p>
        )}
      </div>

      <div className="cart-summary">
        <p className="tax-note">Save books here and move them to your cart anytime.</p>
        <div className="continue-shopping">
          <Link to="/" className="continue-link">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
