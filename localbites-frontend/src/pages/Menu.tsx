import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import { restaurantApi } from '../api/restaurantApi';
import type { Restaurant } from '../api/restaurantApi';
import { menuApi } from '../api/menuApi';
import type { MenuItem } from '../api/menuApi';
import { cartApi } from '../api/cartApi';
import { useAuth } from '../context/AuthContext';
import { useAuthDialog } from '../context/AuthDialogContext';
import { MapPin, Phone, Star, DollarSign, ShoppingCart, Map, Utensils, Loader2 } from 'lucide-react';

const Menu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openAuthDialog } = useAuthDialog();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantAndMenu();
    }
  }, [restaurantId]);

  const fetchRestaurantAndMenu = async () => {
    if (!restaurantId) return;
    
    setLoading(true);
    try {
      const [restaurantData, menuData] = await Promise.all([
        restaurantApi.getById(restaurantId),
        menuApi.getMenuItems(restaurantId)
      ]);
      
      setRestaurant(restaurantData);
      setMenuItems(menuData);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Failed to load restaurant information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (menuItemId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      openAuthDialog();
      return;
    }

    setAddingToCart(menuItemId);
    try {
      await cartApi.addToCart({
        menuItemId,
        quantity: 1
      });
      toast.success('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading restaurant menu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
                         <div className="text-6xl mb-4">
               <Utensils className="w-16 h-16 mx-auto text-gray-400" />
             </div>
            <h2 className="text-2xl font-bold mb-2">Restaurant not found</h2>
            <p className="text-gray-400 mb-4">The restaurant you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/search')} className="bg-white text-black hover:bg-gray-200">
              Browse Restaurants
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-16">
        {/* Restaurant Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {restaurant.name}
                </h1>
                {restaurant.description && (
                  <p className="text-gray-300 text-lg mb-4">
                    {restaurant.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.cuisines?.map((cuisine, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                      {cuisine}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 text-sm text-gray-400">
                                     {restaurant.address && (
                     <div className="flex items-center gap-2">
                       <MapPin className="w-4 h-4" />
                       <span>
                         {typeof restaurant.address === 'string' 
                           ? restaurant.address 
                           : `${restaurant.address.street || ''} ${restaurant.address.city || 'Karachi'} ${restaurant.address.country || 'Pakistan'}`.trim()
                         }
                       </span>
                     </div>
                   )}
                   {restaurant.phone && (
                     <div className="flex items-center gap-2">
                       <Phone className="w-4 h-4" />
                       <span>{restaurant.phone}</span>
                     </div>
                   )}
                   {restaurant.avg_rating && (
                     <div className="flex items-center gap-2">
                       <Star className="w-4 h-4" />
                       <span>{restaurant.avg_rating.toFixed(1)} ({restaurant.review_count} reviews)</span>
                     </div>
                   )}
                   {restaurant.price_range && (
                     <div className="flex items-center gap-2">
                       <DollarSign className="w-4 h-4" />
                       <span>{restaurant.price_range}</span>
                     </div>
                   )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                                 <Button 
                   onClick={() => navigate('/cart')}
                   className="bg-white text-black hover:bg-gray-200"
                 >
                   <ShoppingCart className="w-4 h-4 mr-2" />
                   View Cart
                 </Button>
                 <Button 
                   variant="outline"
                   onClick={() => navigate('/map')}
                   className="border-gray-600 text-gray-300 hover:bg-gray-800"
                 >
                   <Map className="w-4 h-4 mr-2" />
                   View on Map
                 </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {Object.keys(groupedMenuItems).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
               <Utensils className="w-16 h-16 mx-auto text-gray-400" />
             </div>
              <h3 className="text-lg font-medium text-white mb-2">No menu items available</h3>
              <p className="text-gray-400">This restaurant hasn't added their menu yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedMenuItems).map(([category, items]) => (
                <div key={category}>
                                     <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                     <Utensils className="w-6 h-6" />
                     {category}
                   </h2>
                  <Separator className="bg-gray-800 mb-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <Card
                        key={item._id}
                        className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-semibold text-white">
                              {item.name}
                            </CardTitle>
                            <div className="text-lg font-bold text-white">
                              Rs. {item.price}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {item.description && (
                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          
                          {item.ingredients && item.ingredients.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs text-gray-400 mb-1">Ingredients:</p>
                              <p className="text-xs text-gray-300">
                                {item.ingredients.join(', ')}
                              </p>
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {item.isAvailable ? (
                                <Badge variant="secondary" className="bg-green-700 text-green-100">
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-red-700 text-red-100">
                                  Unavailable
                                </Badge>
                              )}
                            </div>
                            
                                                         <Button
                               onClick={() => handleAddToCart(item._id)}
                               disabled={!item.isAvailable || addingToCart === item._id}
                               className="bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                               size="sm"
                             >
                               {addingToCart === item._id ? (
                                 <>
                                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                   Adding...
                                 </>
                               ) : (
                                 <>
                                   <ShoppingCart className="w-4 h-4 mr-2" />
                                   Add to Cart
                                 </>
                               )}
                             </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
