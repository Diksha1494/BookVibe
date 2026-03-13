// // CheckoutPage.jsx
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import './CheckoutPage.css';
// import { useAuth } from '../../context/AuthContext';
// import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
// import Swal from 'sweetalert2';

// const CheckoutPage = () => {
//   const cartItems = useSelector((state) => state.cart.cartItems);
//   const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice, 0).toFixed(2);
//   const {currentUser}= useAuth()

//   const { register, handleSubmit, formState: { errors } } = useForm();

// const [createOrder,{isLoading,error}]= useCreateOrderMutation();

//   const [isChecked, setIsChecked] = useState(false);

//   const onSubmit = async(data) =>{

   
//    const newOrder = {
//         name:data.name,
//         email: currentUser?.email,
//         address: {
//            city:data.city,
//            country:data.country,
//            state:data.state,
//            zipcode:data.zipcode 
//         },
//         phone:data.phone,
//         productIds: cartItems.map(item=>item?._id),
//         totalPrice:totalPrice,
//    }
//    //create an order
  
//      try {
//             await createOrder(newOrder).unwrap();
//             Swal .fire({
//                 title: "Confirmed Order",
//                 text: "Your order placed successfully!",
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#3085d6",
//                 cancelButtonColor: "#d33",
//                 confirmButtonText: "Yes, It's Okay!"
//               });
             
//    } catch (error) {
//     console.error("Couldn't place an order",error);
//     alert("Failed to place an order")
//    }
//   }

//   if(isLoading) return <div>Loading....</div>

//   return (
//     <section className="checkout-section">
//       <div className="checkout-wrapper">
//         <div className="checkout-container">
//           <div className="checkout-header">
//             <h2>Cash On Delivery</h2>
//             <p>Total Price: ${totalPrice}</p>
//             <p>Items: {cartItems.length}</p>
//           </div>

//           <div className="checkout-form-box">
//             <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
//               <div className="form-left">
//                 <p className="form-title">Personal Details</p>
//                 <p>Please fill out all the fields.</p>
//               </div>

//               <div className="form-right">
//                 <div className="form-group">
//                   <label htmlFor="name">Full Name</label>
//                   <input type="text" name="name" id="name" className="input-field" />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="email">Email Address</label>
//                   <input
//                     type="text"
//                     name="email"
//                     id="email"
//                     defaultValue={currentUser?.email}
//                     placeholder="email@domain.com"
//                     className="input-field"
//                     disabled
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="phone">Phone Number</label>
//                   <input type="number" name="phone" id="phone" className="input-field" placeholder="+123 456 7890" />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="address">Address / Street</label>
//                   <input type="text" name="address" id="address" className="input-field" />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="city">City</label>
//                   <input type="text" name="city" id="city" className="input-field" />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="country">Country / Region</label>
//                   <input type="text" name="country" id="country" className="input-field" />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="state">State / Province</label>
//                   <input type="text" name="state" id="state" className="input-field" />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="zipcode">Zipcode</label>
//                   <input type="text" name="zipcode" id="zipcode" className="input-field" />
//                 </div>
//  <div className="form-check">
//                   <input
//                     type="checkbox"
//                     id="billing_same"
//                     onChange={(e) => setIsChecked(e.target.checked)}
//                   />
//                   <label htmlFor="billing_same">
//                     I agree to the <Link to="#" className="link">Terms & Conditions</Link> and <Link to="#" className="link">Shopping Policy</Link>.
//                   </label>
//                 </div>
                   
//                 <div className="form-submit">
                
//                   <button type="submit" disabled={!isChecked}>Place an Order</button>
//                 </div>
//               </div>
//             </form>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default CheckoutPage;
// CheckoutPage.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './CheckoutPage.css';
import { useAuth } from '../../context/AuthContext';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
import Swal from 'sweetalert2';

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice, 0).toFixed(2);
  const { currentUser } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const navigate = useNavigate()
  const [isChecked, setIsChecked] = useState(false);

  const onSubmit = async (data) => {
    const newOrder = {
      name: data.name,
      email: currentUser?.email,
      address: {
        city: data.city,
        country: data.country,
        state: data.state,
        zipcode: data.zipcode,
      },
      phone: data.phone,
      productIds: cartItems.map(item => item?._id),
      totalPrice,
    };

    try {
      await createOrder(newOrder).unwrap();
       Swal.fire({
                title: "Confirmed Order",
                text: "Your order placed successfully!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, It's Okay!"
              });
              navigate("/orders")
    } catch (error) {
      console.error("Couldn't place an order", error);
      alert("Failed to place an order");
    }
  };

  if (isLoading) return <div>Loading....</div>;

  return (
    <section className="checkout-section">
      <div className="checkout-wrapper">
        <div className="checkout-container">
          <div className="checkout-header">
            <h2>Cash On Delivery</h2>
            <p>Total Price: ${totalPrice}</p>
            <p>Items: {cartItems.length}</p>
          </div>

          <div className="checkout-form-box">
            <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
              <div className="form-left">
                <p className="form-title">Personal Details</p>
                <p>Please fill out all the fields.</p>
              </div>

              <div className="form-right">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" className="input-field" {...register("name", { required: true })} />
                  {errors.name && <p className="error">Name is required</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="text"
                    id="email"
                    defaultValue={currentUser?.email}
                    className="input-field"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="number"
                    id="phone"
                    className="input-field"
                    placeholder="+123 456 7890"
                    {...register("phone", { required: true })}
                  />
                  {errors.phone && <p className="error">Phone is required</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" className="input-field" {...register("city", { required: true })} />
                  {errors.city && <p className="error">City is required</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country / Region</label>
                  <input type="text" id="country" className="input-field" {...register("country", { required: true })} />
                  {errors.country && <p className="error">Country is required</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State / Province</label>
                  <input type="text" id="state" className="input-field" {...register("state", { required: true })} />
                  {errors.state && <p className="error">State is required</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="zipcode">Zipcode</label>
                  <input type="text" id="zipcode" className="input-field" {...register("zipcode", { required: true })} />
                  {errors.zipcode && <p className="error">Zipcode is required</p>}
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    id="billing_same"
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <label htmlFor="billing_same">
                    I agree to the <Link to="#" className="link">Terms & Conditions</Link> and <Link to="#" className="link">Shopping Policy</Link>.
                  </label>
                </div>

                <div className="form-submit">
                  <button type="submit" disabled={!isChecked}>Place an Order</button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;

