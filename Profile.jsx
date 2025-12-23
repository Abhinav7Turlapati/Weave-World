import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Profile = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('details');
    const [user, setUser] = useState(null);

    // Mock Data
    const [addresses, setAddresses] = useState([
        { id: 1, type: 'Home', street: '123 Handloom St', city: 'Jaipur', state: 'Rajasthan', zip: '302001', isDefault: true },
        { id: 2, type: 'Work', street: '456 Tech Park', city: 'Bangalore', state: 'Karnataka', zip: '560001', isDefault: false },
    ]);

    const [wallet, setWallet] = useState({
        balance: 2500,
        transactions: [
            { id: 1, date: '2023-10-25', description: 'Refund for Order #1234', amount: 500, type: 'credit' },
            { id: 2, date: '2023-10-20', description: 'Purchase Order #1230', amount: -1200, type: 'debit' },
        ]
    });

    const [orders, setOrders] = useState([
        { id: 'ORD-2023-001', date: '2023-11-01', total: 4500, status: 'Delivered', items: 3 },
        { id: 'ORD-2023-002', date: '2023-11-15', total: 1200, status: 'Shipped', items: 1 },
        { id: 'ORD-2023-003', date: '2023-11-28', total: 850, status: 'Processing', items: 2 },
    ]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const userObj = JSON.parse(userData);
            if (!userObj.isLoggedIn) {
                navigate('/login');
            } else {
                setUser(userObj);
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6 bg-primary-50 border-b border-primary-100">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </div>
                        <nav className="p-2">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'details' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Profile Details
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                My Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('address')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'address' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Address Book
                            </button>
                            <button
                                onClick={() => setActiveTab('wallet')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'wallet' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Wallet
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-2"
                            >
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full md:w-3/4">
                    <div className="bg-white rounded-lg shadow-md p-6 min-h-[500px]">

                        {/* Profile Details Tab */}
                        {activeTab === 'details' && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={user.name}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="Add phone number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                                        <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                                            {user.role === 'owner' ? 'Owner' : user.role === 'admin' ? 'Admin' : 'Customer'}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <button className="btn-primary">Update Profile</button>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex flex-wrap justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-semibold text-primary-700">{order.id}</p>
                                                    <p className="text-sm text-gray-500">Placed on {order.date}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">{order.items} items</p>
                                                    <p className="font-bold text-gray-800">Total: ₹{order.total.toLocaleString()}</p>
                                                </div>
                                                <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Address Book Tab */}
                        {activeTab === 'address' && (
                            <div className="animate-fade-in-up">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Address Book</h2>
                                    <button className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add New Address
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="border border-gray-200 rounded-lg p-4 relative hover:border-primary-300 transition-colors">
                                            {addr.isDefault && (
                                                <span className="absolute top-2 right-2 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">Default</span>
                                            )}
                                            <div className="flex items-center mb-2">
                                                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                <h3 className="font-semibold text-gray-800">{addr.type}</h3>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-1">{addr.street}</p>
                                            <p className="text-gray-600 text-sm mb-3">{addr.city}, {addr.state} - {addr.zip}</p>
                                            <div className="flex space-x-3">
                                                <button className="text-sm text-primary-600 hover:text-primary-800">Edit</button>
                                                <button className="text-sm text-red-500 hover:text-red-700">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Wallet Tab */}
                        {activeTab === 'wallet' && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wallet</h2>

                                <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white mb-8 shadow-lg">
                                    <p className="text-primary-100 mb-1">Available Balance</p>
                                    <h3 className="text-4xl font-bold">₹{wallet.balance.toLocaleString()}</h3>
                                    <div className="mt-6 flex space-x-4">
                                        <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
                                            + Add Money
                                        </button>
                                        <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
                                            Withdraw
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
                                <div className="space-y-3">
                                    {wallet.transactions.map((txn) => (
                                        <div key={txn.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${txn.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {txn.type === 'credit' ? (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                        ) : (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                        )}
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{txn.description}</p>
                                                    <p className="text-xs text-gray-500">{txn.date}</p>
                                                </div>
                                            </div>
                                            <span className={`font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-gray-800'}`}>
                                                {txn.type === 'credit' ? '+' : ''}₹{Math.abs(txn.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
