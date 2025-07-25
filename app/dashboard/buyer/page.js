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

  const handleConfirmOrder = async (orderId, deliveryDate) => {
    try {
      const response = await fetch(`/api/group-orders/${orderId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deliveryDate }),
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert('Group order confirmed successfully!');
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Error confirming order');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'buyer') {
    return null;
  }

  const pendingOrders = groupOrders.filter(order => !order.supplierConfirmed);
  const confirmedOrders = groupOrders.filter(order => order.supplierConfirmed);
  const totalOrders = groupOrders.length;

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
                  <p className="text-sm font-medium text-gray-600">Active Materials</p>
                  <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Confirmed Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{confirmedOrders.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
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
                      label="Material Name"
                      name="name"
                      placeholder="e.g., Tomatoes, Cooking Oil, Wheat Flour"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Description"
                      name="description"
                      placeholder="Brief description of the material"
                      value={formData.description}
                      onChange={handleChange}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="food">Food</option>
                        <option value="construction">Construction</option>
                        <option value="agricultural">Agricultural</option>
                        <option value="industrial">Industrial</option>
                        <option value="textiles">Textiles</option>
                        <option value="chemicals">Chemicals</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Price per Unit (₹)"
                        name="pricePerKg"
                        type="number"
                        step="0.01"
                        value={formData.pricePerKg}
                        onChange={handleChange}
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unit
                        </label>
                        <select
                          name="unit"
                          value={formData.unit}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="kg">Kg</option>
                          <option value="liter">Liter</option>
                          <option value="piece">Piece</option>
                          <option value="meter">Meter</option>
                          <option value="ton">Ton</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Available Quantity"
                        name="availableQuantity"
                        type="number"
                        value={formData.availableQuantity}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Min Order Quantity"
                        name="minOrderQuantity"
                        type="number"
                        value={formData.minOrderQuantity}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Delivery Area"
                        name="deliveryArea"
                        placeholder="e.g., Mumbai Central, Andheri"
                        value={formData.deliveryArea}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Delivery Radius (km)"
                        name="deliveryRadius"
                        type="number"
                        value={formData.deliveryRadius}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1">Add Material</Button>
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
              {materials.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No materials listed yet</p>
                    <p className="text-sm text-gray-500 mt-2">Add materials to start receiving group orders from vendors</p>
                  </CardContent>
                </Card>
              ) : (
                materials.map((material) => (
                  <Card key={material._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{material.name}</CardTitle>
                          <p className="text-sm text-gray-600">{material.category}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteListing(material._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {material.description && (
                          <p className="text-sm text-gray-600">{material.description}</p>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Price per {material.unit}:</span>
                          <span className="font-medium">₹{material.pricePerKg}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Available:</span>
                          <span className="font-medium">{material.availableQuantity} {material.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Min Order:</span>
                          <span className="font-medium">{material.minOrderQuantity} {material.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            Delivery Area:
                          </span>
                          <span className="font-medium">{material.deliveryArea}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Listed:</span>
                          <span className="font-medium">{new Date(material.createdAt).toLocaleDateString()}</span>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Orders for Your Materials</h2>
            <div className="space-y-4">
              {groupOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No group orders yet</p>
                    <p className="text-sm text-gray-500 mt-2">Vendors will create group orders for your listed materials</p>
                  </CardContent>
                </Card>
              ) : (
                groupOrders.map((order) => (
                  <Card key={order._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{order.title}</CardTitle>
                          <p className="text-sm text-gray-600">
                            {order.material.name} • Organized by {order.organizer.businessName}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          !order.supplierConfirmed
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'closed'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'fulfilled'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {!order.supplierConfirmed ? 'Pending Confirmation' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Target Quantity:</span>
                          <span className="font-medium">{order.targetQuantity} {order.material.unit}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Current Quantity:</span>
                          <span className="font-medium">{order.currentQuantity} {order.material.unit}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Participants:</span>
                          <span className="font-medium">{order.participants.length} vendors</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Amount:</span>
                          <span className="font-medium">₹{order.totalAmount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            Delivery:
                          </span>
                          <span className="font-medium">{order.deliveryLocation}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            Deadline:
                          </span>
                          <span className="font-medium">
                            {new Date(order.deadlineDate).toLocaleDateString()}
                          </span>
                        </div>

                        {!order.supplierConfirmed && (
                          <div className="mt-4 space-y-2">
                            <input
                              type="date"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Delivery Date"
                              id={`delivery-date-${order._id}`}
                            />
                            <Button
                              onClick={() => {
                                const deliveryDate = document.getElementById(`delivery-date-${order._id}`).value;
                                handleConfirmOrder(order._id, deliveryDate);
                              }}
                              className="w-full"
                            >
                              Confirm Order
                            </Button>
                          </div>
                        )}

                        {order.supplierConfirmed && order.deliveryDate && (
                          <div className="mt-4 p-3 bg-green-50 rounded-md">
                            <p className="text-sm text-green-800 font-medium">
                              Order confirmed for delivery on {new Date(order.deliveryDate).toLocaleDateString()}
                            </p>
                          </div>
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
