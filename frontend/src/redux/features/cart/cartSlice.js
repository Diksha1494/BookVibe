import { createSlice } from '@reduxjs/toolkit'
import Swal from "sweetalert2";

const popupBase = {
    customClass: {
        popup: "shop-alert-popup",
        title: "shop-alert-title",
        htmlContainer: "shop-alert-text",
        confirmButton: "shop-alert-confirm",
        cancelButton: "shop-alert-cancel"
    },
    buttonsStyling: false
};

const showToast = ({ title, icon }) =>
    Swal.fire({
        ...popupBase,
        toast: true,
        position: "top-end",
        icon,
        title,
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true
    });

const showDialog = ({ title, text, icon, confirmButtonText = "OK" }) =>
    Swal.fire({
        ...popupBase,
        icon,
        title,
        text,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: "Close"
    });

const initialState = {
    cartItems:[],
    wishlistItems:[]
}
const cartSlice = createSlice({
    name:'cart',
    initialState: initialState,
    reducers:{
        addToCart:(state,action)=>{
            const existingItem = state.cartItems.find(item => item._id=== action.payload._id);
            if(!existingItem){
                state.cartItems.push(action.payload)
                showToast({
                    title: "Added to cart",
                    icon: "success"
                });
             } else(
                showDialog({
                    title: "Already in cart",
                    text: "This book is already in your cart.",
                    icon: "info"
                })
        )           
    },


          removeFromCart: (state, action) => {
            state.cartItems =  state.cartItems.filter(item => item._id !== action.payload._id)
        },
        clearCart: (state) => {
            state.cartItems = []
        },
        addToWishlist: (state, action) => {
            const existingItem = state.wishlistItems.find(item => item._id === action.payload._id);
            if(!existingItem) {
                state.wishlistItems.push(action.payload);
                showToast({
                    title: "Added to wishlist",
                    icon: "success"
                });
            } else {
                showToast({
                    title: "Already in wishlist",
                    icon: "info"
                });
            }
        },
        removeFromWishlist: (state, action) => {
            state.wishlistItems = state.wishlistItems.filter(item => item._id !== action.payload._id);
        }
    }
})

export const {addToCart,removeFromCart, clearCart, addToWishlist, removeFromWishlist}=cartSlice.actions;
        export default cartSlice.reducer;
    
