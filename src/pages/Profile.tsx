import { useState } from 'react';
import { User, Package, MapPin, CreditCard, LogOut, Edit2, ChevronRight, Milk, Calendar, Phone, Mail, ShoppingBag } from 'lucide-react';

export default function DairyProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    memberSince: 'January 2024',
    address: '123 Main Street, Apartment 4B, Erattupetta, Kerala - 686121'
  };

  // Mock orders data
  const orders = [
    {
      id: 'ORD-2024-1234',
      date: '2024-10-28',
      items: ['Milk 1L x 2', 'Curd 500g x 1', 'Butter 200g x 1'],
      total: 285,
      status: 'Delivered'
    },
    {
      id: 'ORD-2024-1233',
      date: '2024-10-25',
      items: ['Milk 1L x 3', 'Paneer 250g x 1'],
      total: 340,
      status: 'Delivered'
    },
    {
      id: 'ORD-2024-1232',
      date: '2024-10-22',
      items: ['Milk 1L x 2', 'Ghee 500g x 1'],
      total: 875,
      status: 'Delivered'
    },
    {
      id: 'ORD-2024-1231',
      date: '2024-10-20',
      items: ['Milk 1L x 4', 'Curd 500g x 2'],
      total: 380,
      status: 'Cancelled'
    }
  ];

  // Mock subscription data
  const subscription = {
    active: true,
    plan: 'Daily Milk - 1L',
    frequency: 'Every Morning',
    nextDelivery: '2024-10-31',
    amount: 60
  };

  const handleLogout = () => {
    alert('Logging out...');
    console.log('User logged out');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 mt-16">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Milk className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Vyshnavi Dairy</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{userData.name}</h2>
                <p className="text-sm text-gray-500">Member since {userData.memberSince}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'overview', icon: User, label: 'Overview' },
                  { id: 'orders', icon: Package, label: 'Order History' },
                  { id: 'address', icon: MapPin, label: 'Addresses' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm">Total Orders</p>
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm">Total Spent</p>
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">₹{orders.reduce((sum, order) => sum + order.total, 0)}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm">Active Plan</p>
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-xl font-bold text-gray-800">{subscription.active ? 'Active' : 'None'}</p>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Profile Information</h3>
                    <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-gray-800 font-medium">{userData.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="text-gray-800 font-medium">{userData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="text-gray-800 font-medium">{userData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Delivery Address</p>
                        <p className="text-gray-800 font-medium">{userData.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-800">{order.id}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{order.items.join(', ')}</p>
                        <div className="flex items-center justify-between text-sm">
                          <p className="text-gray-500">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          <p className="font-bold text-gray-800">₹{order.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Order History</h3>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">{order.id}</p>
                          <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 font-medium mb-1">Items:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {order.items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <p className="font-bold text-gray-800">Total Amount</p>
                        <p className="font-bold text-blue-600 text-lg">₹{order.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Subscription Details</h3>
                {subscription.active ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-800">{subscription.plan}</h4>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600">Delivery Frequency</p>
                          <p className="font-semibold text-gray-800">{subscription.frequency}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600">Next Delivery</p>
                          <p className="font-semibold text-gray-800">{new Date(subscription.nextDelivery).toLocaleDateString('en-IN')}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600">Amount per Delivery</p>
                          <p className="font-semibold text-blue-600">₹{subscription.amount}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Modify Plan
                      </button>
                      <button className="flex-1 bg-red-50 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100 transition">
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No active subscription</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                      Browse Plans
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'address' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Delivery Addresses</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    Add New
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium">Default</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-800 font-medium mb-1">Home</p>
                    <p className="text-gray-600 text-sm">{userData.address}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Order Updates', description: 'Get notified about your order status' },
                    { label: 'Promotional Offers', description: 'Receive special offers and discounts' },
                    { label: 'Delivery Reminders', description: 'Reminders before scheduled delivery' },
                    { label: 'Newsletter', description: 'Weekly updates about new products' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Payment Methods</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    Add Card
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="border-2 border-blue-500 rounded-lg p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <CreditCard className="w-8 h-8" />
                      <span className="text-xs font-medium bg-white text-blue-600 px-2 py-1 rounded">Default</span>
                    </div>
                    <p className="text-sm mb-2">•••• •••• •••• 4532</p>
                    <div className="flex items-center justify-between text-sm">
                      <p>Expires 12/26</p>
                      <p>Visa</p>
                    </div>
                  </div>
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Add a new payment method</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}