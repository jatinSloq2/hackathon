'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Package, Users, Clock, CheckCircle, Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react';

export default function BuyerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [materials, setMaterials] = useState([]);
  const [groupOrders, setGroupOrders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'food',
    pricePerKg: '',
    availableQuantity: '',
    minOrderQuantity: '',
    unit: 'kg',
    deliveryArea: '',
    deliveryRadius: '50'
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
      return;
    }

    if (session.user.role !== 'buyer') {
      router.push('/dashboard/vendor');
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch my materials
      const materialsRes = await fetch('/api/materials');
      if (materialsRes.ok) {
        const materialsData = await materialsRes.json();
        // Filter to show only materials from this supplier
        const myMaterials = materialsData.materials.filter(
          m => m.supplier._id === session.user.id
        );
        setMaterials(myMaterials);
      }

      // Fetch group orders for my materials
      const groupOrdersRes = await fetch('/api/group-orders');
      if (groupOrdersRes.ok) {
        const groupOrdersData = await groupOrdersRes.json();
        // Filter group orders that are for my materials
        const myGroupOrders = groupOrdersData.groupOrders.filter(order =>
          materials.some(material => material._id === order.material._id)
        );
        setGroupOrders(myGroupOrders);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pricePerKg: parseFloat(formData.pricePerKg),
          availableQuantity: parseFloat(formData.availableQuantity),
          minOrderQuantity: parseFloat(formData.minOrderQuantity || 1),
          deliveryRadius: parseFloat(formData.deliveryRadius || 50),
        }),
      });

      if (response.ok) {
        setFormData({
          name: '',
          description: '',
          category: 'food',
          pricePerKg: '',
          availableQuantity: '',
          minOrderQuantity: '',
          unit: 'kg',
          deliveryArea: '',
          deliveryRadius: '50'
        });
        setShowAddForm(false);
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error creating material:', error);
      alert('Error creating material listing');
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Error deleting material');
    }
  };

  const handleAcceptOrder = (orderId) => {
    const updatedOrders = vendorGroupOrders.map(order => 
      order.id === orderId ? { ...order, status: 'accepted' } : order
    );
    setGroupOrders(updatedOrders);
    localStorage.setItem('groupOrders', JSON.stringify(updatedOrders));
  };

  const handleFulfillOrder = (orderId) => {
    const updatedOrders = vendorGroupOrders.map(order => 
      order.id === orderId ? { ...order, status: 'fulfilled' } : order
    );
    setGroupOrders(updatedOrders);
    localStorage.setItem('groupOrders', JSON.stringify(updatedOrders));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'buyer') {
    return null;
  }

  const pendingOrders = vendorGroupOrders.filter(order => order.status === 'pending');
  const acceptedOrders = vendorGroupOrders.filter(order => order.status === 'accepted');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {session.user.name}!</p>
          <p className="text-sm text-blue-600">{session.user.businessName} • {session.user.location}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Accepted Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{acceptedOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{vendorGroupOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Material Listings */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Material Listings</h2>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Listing
              </Button>
            </div>

            {showAddForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Add New Material Listing</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Material"
                      name="material"
                      placeholder="e.g., Tomatoes, Cooking Oil, Wheat Flour"
                      value={formData.material}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Price per Kg (₹)"
                      name="pricePerKg"
                      type="number"
                      value={formData.pricePerKg}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Available Quantity (kg)"
                      name="availableQuantity"
                      type="number"
                      value={formData.availableQuantity}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Delivery Area"
                      name="deliveryArea"
                      placeholder="e.g., Mumbai Central, Andheri"
                      value={formData.deliveryArea}
                      onChange={handleChange}
                      required
                    />
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1">Add Listing</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {listings.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No materials listed yet</p>
                    <p className="text-sm text-gray-500 mt-2">Add materials to start receiving group orders from vendors</p>
                  </CardContent>
                </Card>
              ) : (
                listings.map((listing) => (
                  <Card key={listing.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{listing.material}</CardTitle>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Price per kg:</span>
                          <span className="font-medium">₹{listing.pricePerKg}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Available:</span>
                          <span className="font-medium">{listing.availableQuantity} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Delivery Area:</span>
                          <span className="font-medium">{listing.deliveryArea}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Listed:</span>
                          <span className="font-medium">{new Date(listing.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Group Orders from Vendors */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Orders from Vendors</h2>
            <div className="space-y-4">
              {vendorGroupOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No group orders yet</p>
                    <p className="text-sm text-gray-500 mt-2">Vendors will place group orders for your listed materials</p>
                  </CardContent>
                </Card>
              ) : (
                vendorGroupOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{order.material}</CardTitle>
                          <p className="text-sm text-gray-600">{order.requestedBy}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'accepted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <span className="font-medium">{order.quantity}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Participants:</span>
                          <span className="font-medium">{order.participants} vendors</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Submitted:</span>
                          <span className="font-medium">{new Date(order.submittedAt).toLocaleDateString()}</span>
                        </div>
                        
                        {order.status === 'pending' && (
                          <Button onClick={() => handleAcceptOrder(order.id)} className="w-full mt-4">
                            Accept Order
                          </Button>
                        )}
                        
                        {order.status === 'accepted' && (
                          <Button onClick={() => handleFulfillOrder(order.id)} className="w-full mt-4" variant="outline">
                            Mark as Fulfilled
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
