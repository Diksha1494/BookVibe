import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useGetOrderByEmailQuery } from '../../../redux/features/orders/ordersApi';

const UserDashboard = () => {
    const { currentUser } = useAuth();
    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error getting orders data</div>;

    return (
        <div className=" bg-gray-100 py-16">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
                <p className="text-gray-700 mb-6">Welcome, {currentUser?.name || 'User'}! Here are your recent orders:</p>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <Link
                        to="/sell-book"
                        className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 shadow-sm no-underline hover:shadow-md transition-all"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <p className="text-sm text-gray-600 mb-2">Marketplace</p>
                        <h2 className="text-xl font-semibold mb-1">Sell Your Book</h2>
                        <p className="text-gray-700">Create a community listing for selling, borrowing, or exchange.</p>
                    </Link>

                    <Link
                        to="/my-listings"
                        className="bg-amber-50 border border-amber-100 rounded-lg p-4 shadow-sm no-underline hover:shadow-md transition-all"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <p className="text-sm text-gray-600 mb-2">Marketplace</p>
                        <h2 className="text-xl font-semibold mb-1">My Listings</h2>
                        <p className="text-gray-700">Manage your listings and review marketplace activity.</p>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <Link
                        to="/borrow-requests"
                        className="bg-sky-50 border border-sky-100 rounded-lg p-4 shadow-sm no-underline hover:shadow-md transition-all"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <p className="text-sm text-gray-600 mb-2">Requests</p>
                        <h2 className="text-xl font-semibold mb-1">Borrow Requests</h2>
                        <p className="text-gray-700">Track books you requested to borrow from other readers.</p>
                    </Link>

                    <Link
                        to="/exchange-requests"
                        className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 shadow-sm no-underline hover:shadow-md transition-all"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <p className="text-sm text-gray-600 mb-2">Requests</p>
                        <h2 className="text-xl font-semibold mb-1">Exchange Requests</h2>
                        <p className="text-gray-700">See the exchange offers you have sent through the marketplace.</p>
                    </Link>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                    {orders.length > 0 ? (
                        <ul className="space-y-4">
                            {orders.map((order) => (
                                <li key={order._id} className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-1">
                                    <p className="font-medium">Order ID: {order._id}</p>
                                    <p>Date: {new Date(order?.createdAt).toLocaleDateString()}</p>
                                    <p >Total: ${order.totalPrice}</p>
                                    {order.productIds.map((productId) => (
                                        <p key={productId} className='ml-1'>{productId}</p>
                                    ))}
                                </li>


                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">You have no recent orders.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
