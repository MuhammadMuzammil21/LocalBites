import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import { adminApi } from '../api/adminApi';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalRestaurants: 0,
    totalUsers: 0,
    ordersToday: 0,
    revenueToday: 0,
    averageOrderValue: 0,
    topRestaurants: []
  });
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData, restaurantsData] = await Promise.all([
        adminApi.getStats().catch(() => ({
          totalOrders: 0,
          totalRevenue: 0,
          totalRestaurants: 0,
          totalUsers: 0,
          ordersToday: 0,
          revenueToday: 0,
          averageOrderValue: 0,
          topRestaurants: []
        })),
        adminApi.getAllOrders(1, 10).catch(() => ({ orders: [], pagination: {} })),
        adminApi.getAllRestaurants(1, 10).catch(() => ({ restaurants: [], pagination: {} }))
      ]);

      setStats(statsData);
      setOrders(ordersData.orders || []);
      setRestaurants(restaurantsData.restaurants || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleUpdateRestaurantStatus = async (restaurantId: string, isVerified: boolean) => {
    try {
      await adminApi.updateRestaurantStatus(restaurantId, isVerified);
      toast.success(`Restaurant ${isVerified ? 'verified' : 'unverified'} successfully`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating restaurant status:', error);
      toast.error('Failed to update restaurant status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-600';
      case 'confirmed': return 'bg-blue-600';
      case 'preparing': return 'bg-orange-600';
      case 'out_for_delivery': return 'bg-purple-600';
      case 'delivered': return 'bg-green-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              ⚙️ Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Manage orders, restaurants, and monitor system performance
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                📊 Overview
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                📋 Orders
              </TabsTrigger>
              <TabsTrigger value="restaurants" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                🍽️ Restaurants
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                📈 Analytics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
                    <p className="text-xs text-gray-400 mt-1">
                      📈 {stats.ordersToday} today
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">Rs. {stats.totalRevenue}</div>
                    <p className="text-xs text-gray-400 mt-1">
                      💰 Rs. {stats.revenueToday} today
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Restaurants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.totalRestaurants}</div>
                    <p className="text-xs text-gray-400 mt-1">
                      🏪 Active partners
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Avg Order Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">Rs. {stats.averageOrderValue}</div>
                    <p className="text-xs text-gray-400 mt-1">
                      📊 Per order
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    📋 Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-gray-400">No orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order: any) => (
                        <div key={order._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white">Order #{order._id.slice(-6)}</span>
                              <Badge className={`${getStatusColor(order.status)} text-white`}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-300">
                              {order.user?.name} • {order.restaurant?.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              Rs. {order.totalAmount} • {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/orders/${order._id}`)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-600"
                          >
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    📋 All Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-gray-400">No orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order._id} className="p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">Order #{order._id.slice(-6)}</span>
                              <Badge className={`${getStatusColor(order.status)} text-white`}>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="text-lg font-bold text-white">
                              Rs. {order.totalAmount}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Customer</p>
                              <p className="text-white">{order.user?.name}</p>
                              <p className="text-gray-300">{order.user?.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Restaurant</p>
                              <p className="text-white">{order.restaurant?.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Order Date</p>
                              <p className="text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                              <p className="text-gray-300">{new Date(order.createdAt).toLocaleTimeString()}</p>
                            </div>
                          </div>

                          <Separator className="bg-gray-600 my-3" />

                          <div className="flex gap-2 flex-wrap">
                            {['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((status) => (
                              <Button
                                key={status}
                                variant={order.status === status ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order._id, status)}
                                className={order.status === status 
                                  ? "bg-white text-black" 
                                  : "border-gray-600 text-gray-300 hover:bg-gray-600"
                                }
                              >
                                {status.replace('_', ' ')}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Restaurants Tab */}
            <TabsContent value="restaurants" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    🍽️ All Restaurants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {restaurants.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🍽️</div>
                      <p className="text-gray-400">No restaurants found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {restaurants.map((restaurant: any) => (
                        <div key={restaurant._id} className="p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white text-lg">{restaurant.name}</span>
                              <Badge className={restaurant.is_verified ? "bg-green-600 text-white" : "bg-yellow-600 text-white"}>
                                {restaurant.is_verified ? 'Verified' : 'Pending'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              {restaurant.avg_rating && (
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-400">⭐</span>
                                  <span className="text-white">{restaurant.avg_rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {restaurant.description && (
                            <p className="text-gray-300 text-sm mb-3">{restaurant.description}</p>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-gray-400">Address</p>
                              <p className="text-white">
                                {typeof restaurant.address === 'string' 
                                  ? restaurant.address 
                                  : `${restaurant.address?.street || ''} ${restaurant.address?.city || 'Karachi'} ${restaurant.address?.country || 'Pakistan'}`.trim()
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">Contact</p>
                              <p className="text-white">{restaurant.phone || 'Not provided'}</p>
                            </div>
                          </div>

                          {restaurant.cuisines && restaurant.cuisines.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {restaurant.cuisines.map((cuisine: string, index: number) => (
                                <Badge key={index} variant="secondary" className="bg-gray-600 text-gray-300">
                                  {cuisine}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              variant={restaurant.is_verified ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleUpdateRestaurantStatus(restaurant._id, !restaurant.is_verified)}
                              className={restaurant.is_verified 
                                ? "border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white" 
                                : "bg-green-600 text-white hover:bg-green-700"
                              }
                            >
                              {restaurant.is_verified ? '❌ Unverify' : '✅ Verify'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/menu/${restaurant._id}`)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-600"
                            >
                              🍽️ View Menu
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      📈 Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Orders</span>
                      <span className="text-white font-bold">{stats.totalOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Revenue</span>
                      <span className="text-white font-bold">Rs. {stats.totalRevenue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Average Order Value</span>
                      <span className="text-white font-bold">Rs. {stats.averageOrderValue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Active Restaurants</span>
                      <span className="text-white font-bold">{stats.totalRestaurants}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      🏆 Top Restaurants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.topRestaurants && stats.topRestaurants.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topRestaurants.slice(0, 5).map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">#{index + 1}</span>
                              <span className="text-white">{item.restaurant?.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">Rs. {item.revenue}</div>
                              <div className="text-xs text-gray-400">{item.orderCount} orders</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">📊</div>
                        <p className="text-gray-400">No analytics data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
