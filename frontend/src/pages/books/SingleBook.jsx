import React from 'react'
import { FiShoppingCart } from "react-icons/fi"
import { HiOutlineHeart, HiHeart } from "react-icons/hi2"
import { useNavigate, useParams } from "react-router-dom"

import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishlist, removeFromWishlist } from '../../redux/features/cart/cartSlice';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';
import { useAuth } from '../../context/AuthContext';

const SingleBook = () => {
    const {id} = useParams();
    const {data: book, isLoading, isError} = useFetchBookByIdQuery(id);

    const dispatch =  useDispatch();
    const navigate = useNavigate();
    const wishlistItems = useSelector((state) => state.cart.wishlistItems);
    const { currentUser } = useAuth();
    const isWishlisted = wishlistItems.some((item) => item._id === book?._id);

    const handleAddToCart = (product) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        dispatch(addToCart(product))
    }

    const handleWishlistToggle = (product) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        if (isWishlisted) {
            dispatch(removeFromWishlist(product));
            return;
        }
        dispatch(addToWishlist(product));
    }

    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>Error happending to load book info</div>
  return (
    <div className="max-w-lg shadow-md p-5">
            <h1 className="text-2xl font-bold mb-6">{book.title}</h1>

            <div className=''>
                <div>
                    <img
                        src={`${getImgUrl(book.coverImage)}`}
                        alt={book.title}
                        className="mb-8"
                    />
                </div>

                <div className='mb-5'>
                    <p className="text-gray-700 mb-2"><strong>Author:</strong> {book.author || 'admin'}</p>
                    <p className="text-gray-700 mb-4">
                        <strong>Published:</strong> {new Date(book?.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-4 capitalize">
                        <strong>Category:</strong> {book?.category}
                    </p>
                    <p className="text-gray-700"><strong>Description:</strong> {book.description}</p>
                </div>

                <div className="book-actions">
                    <button onClick={() => handleAddToCart(book)} className="btn-primary px-6 space-x-1 flex items-center gap-1 ">
                        <FiShoppingCart className="" />
                        <span>Add to Cart</span>
                    </button>
                    <button onClick={() => handleWishlistToggle(book)} className={`btn-secondary ${isWishlisted ? "btn-secondary-active" : ""}`}>
                        {isWishlisted ? <HiHeart /> : <HiOutlineHeart />}
                        <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
                    </button>
                </div>
            </div>
        </div>
  )
}

export default SingleBook
