import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { useAuthDialog } from '../context/AuthDialogContext';
import { authApi, Address } from '../api/authApi';
import { orderApi } from '../api/orderApi';
import { restaurantApi } from '../api/restaurantApi';
import { cartApi } from '../api/cartApi';
import ProfileDetails from '../components/user/ProfileDetails';
import SavedAddresses from '../components/user/SavedAddresses';
import OrderHistory from '../components/user/OrderHistory';
import RestaurantRecommendations from '../components/user/RestaurantRecommendations';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
  createdAt: string;
  addresses?: Address[];
}

interface Order {
  _id: string;
  restaurant: {
    _id: string;
    name: string;
  };
  items: {
    menuItem: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { openAuthDialog } = useAuthDialog();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthDialog();
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, openAuthDialog]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profileData, ordersData, recommendationsData] = await Promise.all([
        authApi.getProfile().catch(() => null),
        orderApi.getUserOrders().catch(() => []),
        restaurantApi.getRecommendations().catch(() => [])
      ]);

      if (profileData) {
        setProfile({
          _id: profileData._id,
          name: profileData.name,
          email: profileData.email,
          role: profileData.role,
          createdAt: profileData.createdAt || new Date().toISOString(),
          addresses: profileData.addresses || []
        });
      }
      
      // Handle orders data - check if it's an array or object with orders property
      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      } else if (ordersData && typeof ordersData === 'object' && 'orders' in ordersData) {
        setOrders((ordersData as any).orders || []);
      } else {
        setOrders([]);
      }
      
      setRecommendations(recommendationsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (order: Order) => {
    try {
      await cartApi.reorder(order.items);
      toast.success('Items added to cart successfully!');
      navigate('/cart');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to reorder items');
    }
  };

  const handleProfileUpdate = async (updatedData: Partial<UserProfile>) => {
    try {
      const updatedProfile = await authApi.updateProfile(updatedData as any);
      if (updatedProfile) {
        setProfile({
          _id: updatedProfile._id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          role: updatedProfile.role,
          createdAt: updatedProfile.createdAt || new Date().toISOString(),
          addresses: updatedProfile.addresses || []
        });
      }
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading your dashboard...</p>
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
              Welcome back, {profile?.name || 'User'}!
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your profile, orders, and discover new restaurants
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
              <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                Orders
              </TabsTrigger>
              <TabsTrigger value="addresses" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                Addresses
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                For You
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <ProfileDetails 
                profile={profile} 
                onUpdate={handleProfileUpdate}
              />
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <OrderHistory 
                orders={orders} 
                onReorder={handleReorder}
              />
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-6">
              <SavedAddresses 
                addresses={profile?.addresses || []}
                onUpdate={handleProfileUpdate}
              />
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              <RestaurantRecommendations 
                recommendations={recommendations}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
