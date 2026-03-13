import React from 'react';
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi';
import { useAuth } from '../../context/AuthContext';
import './OrderPage.css';

const OrderPage = () => {
    const { currentUser } = useAuth();

    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser.email);
    console.log("Current User Email:", currentUser?.email);


    if (isLoading) return <div style={{ padding: '20px', fontSize: '18px' }}>Loading...</div>;
    if (isError) return <div style={{ padding: '20px', color: 'red' }}>Error getting orders data</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
          

            <h2 className="heading">Your Orders</h2>
            {
                orders.length === 0 ? (
                    <div className="no-orders">No orders found!</div>
                ) : (
                    <div>
                        {
                            orders.map((order, index) => (
                                <div key={order._id} className="order-item">
                                    <p className='order-index'># {index + 1}</p>
                                    <h3 className="order-id">Order ID: {order._id}</h3>
                                    <p className="text-muted">Name: {order.name}</p>
                                    <p className="text-muted">Email: {order.email}</p>
                                    <p className="text-muted">Phone: {order.phone}</p>
                                    <p className="text-muted">Total Price: ${order.totalPrice}</p>

                                    <h3 className="section-title">Address:</h3>
                                    <p className="text-muted">
                                        {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                                    </p>

                                    <h3 className="section-title">Products Id:</h3>
                                    <ul className="product-list">
                                        {order.productIds.map((productId) => (
                                            <li key={productId} className="product-id">{productId}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default OrderPage;
