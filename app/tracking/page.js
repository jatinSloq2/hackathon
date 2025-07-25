'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/Button';
import { Package, Clock, CheckCircle, Truck, MapPin, Calendar, User } from 'lucide-react';

export default function OrderTracking() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groupOrders, setGroupOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login');
      return;
    }

    fetchOrders();
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch group orders where user is a participant or organizer
      const response = await fetch('/api/group-orders');
      if (response.ok) {
        const data = await response.json();
        
        // Filter orders where user is involved
        const userOrders = data.groupOrders.filter(order => 
          order.organizer._id === session.user.id ||
          order.participants.some(p => p.user._id === session.user.id) ||
          (order.supplier && order.supplier._id === session.user.id)
        );
        
        setGroupOrders(userOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status, supplierConfirmed) => {
    if (!supplierConfirmed) {
      return <Clock className="h-5 w-5 text-yellow-600" />;
    }
    
    switch (status) {
      case 'open':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'closed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fulfilled':
        return <Truck className="h-5 w-5 text-purple-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status, supplierConfirmed) => {
    if (!supplierConfirmed) {
      return 'Awaiting Supplier Confirmation';
    }
    
    switch (status) {
      case 'open':
        return 'Open for Participants';
      case 'closed':
        return 'Order Confirmed - Preparing';
      case 'fulfilled':
        return 'Order Fulfilled - In Transit';
      case 'completed':
        return 'Order Completed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusColor = (status, supplierConfirmed) => {
    if (!supplierConfirmed) {
      return 'bg-yellow-100 text-yellow-800';
    }
    
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'fulfilled':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserRole = (order) => {
    if (order.organizer._id === session.user.id) {
      return 'Organizer';
    } else if (order.supplier && order.supplier._id === session.user.id) {
      return 'Supplier';
    } else if (order.participants.some(p => p.user._id === session.user.id)) {
      return 'Participant';
    }
    return 'Unknown';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
          <p className="mt-2 text-gray-600">Track the status of your group orders</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{groupOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {groupOrders.filter(o => !o.supplierConfirmed).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {groupOrders.filter(o => o.supplierConfirmed && o.status === 'closed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Fulfilled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {groupOrders.filter(o => o.status === 'fulfilled' || o.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {groupOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-600">You haven't participated in any group orders yet.</p>
                <Button 
                  onClick={() => router.push(`/dashboard/${session.user.role}`)}
                  className="mt-4"
                >
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            groupOrders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{order.title}</CardTitle>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm text-gray-600">
                          <User className="inline h-4 w-4 mr-1" />
                          Your role: <span className="font-medium">{getUserRole(order)}</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          Material: <span className="font-medium">{order.material.name}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status, order.supplierConfirmed)}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status, order.supplierConfirmed)}`}>
                        {getStatusText(order.status, order.supplierConfirmed)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Order Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Organized by:</span>
                          <span className="font-medium">{order.organizer.businessName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Target Qty:</span>
                          <span className="font-medium">{order.targetQuantity} {order.material.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Qty:</span>
                          <span className="font-medium">{order.currentQuantity} {order.material.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Participants:</span>
                          <span className="font-medium">{order.participants.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-medium">₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Location & Timeline */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Location & Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600">Delivery Location</p>
                            <p className="font-medium">{order.deliveryLocation}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600">Deadline</p>
                            <p className="font-medium">{new Date(order.deadlineDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {order.deliveryDate && (
                          <div className="flex items-start space-x-2">
                            <Truck className="h-4 w-4 text-gray-500 mt-1" />
                            <div>
                              <p className="text-sm text-gray-600">Delivery Date</p>
                              <p className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Progress</h4>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Quantity Progress</span>
                          <span>{Math.round((order.currentQuantity / order.targetQuantity) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min((order.currentQuantity / order.targetQuantity) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {order.supplier && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm font-medium text-blue-900">Supplier</p>
                          <p className="text-sm text-blue-700">{order.supplier.businessName}</p>
                        </div>
                      )}
                      
                      {/* My participation */}
                      {order.participants.some(p => p.user._id === session.user.id) && (
                        <div className="mt-4 p-3 bg-green-50 rounded-md">
                          <p className="text-sm font-medium text-green-900">Your Order</p>
                          <p className="text-sm text-green-700">
                            {order.participants.find(p => p.user._id === session.user.id)?.quantity} {order.material.unit}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
