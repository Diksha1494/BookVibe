import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Cart.css';
import { getImgUrl } from '../../utils/getImgUrl';
import { clearCart, removeFromCart } from '../../redux/features/cart/cartSlice';
const CartPage = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch()
  //to calculate the total value of cart
  const totalPrice= cartItems.reduce((acc,item)=> acc + item.newPrice,0).toFixed(2);
  const handleRemoveFromCart = (product) =>{
      dispatch(removeFromCart(product))
  }
    const handleClearCart = () =>{
      dispatch(clearCart())
    }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">Shopping Cart</h2>
        <button
        onClick ={handleClearCart}
         className="clear-cart-btn">Clear Cart</button>
      </div>

      <div className="cart-items">
        {cartItems.length > 0 ? (
          <ul className="item-list">
            {cartItems.map((product) => (
              <li key={product?._id} className="cart-item">
                <div className="item-image">
                  <img src={`${getImgUrl(product?.coverImage)}`} alt="Book" />
                </div>
                <div className="item-details">
                  <div className="item-header">
                    <h3 className="item-title">
                      <Link to="/">{product?.title}</Link>
                    </h3>
                    <p className="item-price">{product?.newPrice}</p>
                  </div>
                  <p className="item-category"><strong>Category:</strong>{product?.category}</p>
                  <div className="item-footer">
                    <p><strong>Qty:</strong> 1</p>
                    <button 
                    onClick={()=>
                    handleRemoveFromCart(product)}
                    className="remove-btn">Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">No Products Found</p>
        )}
      </div>

      <div className="cart-summary">
        <div className="subtotal">
          <p>Subtotal</p>
          <p>${totalPrice ? totalPrice : 0}</p>
        </div>
        <p className="tax-note">Shipping and taxes calculated at checkout.</p>
        <Link to="/checkout" className="checkout-btn">Checkout</Link>
        <div className="continue-shopping">
          or
          <Link to="/" className="continue-link">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage;
