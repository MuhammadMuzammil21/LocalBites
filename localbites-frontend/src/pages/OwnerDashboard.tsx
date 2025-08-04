import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Clock,
  Star,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  uniqueCustomers: number;
  avgOrdersPerCustomer: number;
  avgSpentPerCustomer: number;
}

interface Order {
  _id: string;
  trackingCode: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    menuItem: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  user: {
    name: string;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const OwnerDashboard: React.FC = () => {
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Get user's restaurant ID (assuming user has one restaurant)
    fetchUserRestaurant();
  }, []);

  useEffect(() => {
    if (restaurantId) {
      fetchDashboardData();
    }
  }, [restaurantId]);

  const fetchUserRestaurant = async () => {
    try {
      const response = await fetch('/api/restaurants/owner', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      
      if (data.success && data.restaurants.length > 0) {
        setRestaurantId(data.restaurants[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch user restaurant:', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard overview
      const overviewResponse = await fetch(`/api/owner/dashboard/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const overviewData = await overviewResponse.json();

      if (overviewData.success) {
        setStats(overviewData.overview.orders);
        setOrders(overviewData.overview.recentOrders);
        setReviews(overviewData.overview.recentReviews);
      }

      // Fetch menu items
      const menuResponse = await fetch(`/api/owner/${restaurantId}/menu`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const menuData = await menuResponse.json();

      if (menuData.success) {
        setMenuItems(menuData.menuItems);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/owner/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success('Order status updated');
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Preparing':
        return 'bg-orange-100 text-orange-800';
      case 'Ready':
        return 'bg-green-100 text-green-800';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Restaurant Found</h2>
          <p className="text-gray-600">You need to register a restaurant first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  PKR {(stats?.totalRevenue || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  PKR {(stats?.avgOrderValue || 0).toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.uniqueCustomers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +8.3% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders from your restaurant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">#{order.trackingCode}</p>
                        <p className="text-sm text-gray-600">{order.user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <p className="font-medium">PKR {order.totalAmount}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>
                Latest customer feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review._id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{review.user.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {format(new Date(review.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <h4 className="font-medium mb-1">{review.title}</h4>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                Manage and track all orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">#{order.trackingCode}</h3>
                        <p className="text-sm text-gray-600">{order.user.name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.menuItem.name} x{item.quantity}</span>
                          <span>PKR {item.menuItem.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="font-medium">Total: PKR {order.totalAmount}</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateOrderStatus(order._id, 'Confirmed')}
                          disabled={order.status !== 'Pending'}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateOrderStatus(order._id, 'Preparing')}
                          disabled={!['Confirmed', 'Pending'].includes(order.status)}
                        >
                          Preparing
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateOrderStatus(order._id, 'Ready')}
                          disabled={order.status !== 'Preparing'}
                        >
                          Ready
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Menu Management</CardTitle>
              <CardDescription>
                Manage your restaurant menu items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <div key={item._id} className="border rounded-lg p-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <Badge variant={item.available ? 'default' : 'secondary'}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">PKR {item.price}</p>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>
                  Daily revenue for the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { date: '2024-01-01', revenue: 1200 },
                    { date: '2024-01-02', revenue: 1800 },
                    { date: '2024-01-03', revenue: 1500 },
                    { date: '2024-01-04', revenue: 2200 },
                    { date: '2024-01-05', revenue: 1900 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>
                  Current order status breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Pending', value: 5 },
                        { name: 'Confirmed', value: 8 },
                        { name: 'Preparing', value: 3 },
                        { name: 'Ready', value: 2 },
                        { name: 'Delivered', value: 15 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 