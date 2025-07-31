import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import { restaurantApi, Restaurant } from '../api/restaurantApi';

const Map = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const cuisines = [
    'All', 'Pakistani', 'Chinese', 'Italian', 'Fast Food', 
    'Burgers', 'Pizza', 'Desserts', 'Cafe', 'Seafood'
  ];

  // Karachi areas with coordinates
  const karachiAreas = [
    { name: 'Clifton', lat: 24.8138, lng: 67.0648, restaurants: 0 },
    { name: 'Saddar', lat: 24.8607, lng: 67.0011, restaurants: 0 },
    { name: 'DHA', lat: 24.8059, lng: 67.0756, restaurants: 0 },
    { name: 'Gulshan-e-Iqbal', lat: 24.9056, lng: 67.0822, restaurants: 0 },
    { name: 'North Nazimabad', lat: 24.9265, lng: 67.0362, restaurants: 0 },
    { name: 'Korangi', lat: 24.8546, lng: 67.1598, restaurants: 0 },
  ];

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchQuery, selectedCuisine]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await restaurantApi.getAll();
      const restaurantData = response.data || response;
      setRestaurants(Array.isArray(restaurantData) ? restaurantData : []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to load restaurants');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.description?.toLowerCase().includes(query) ||
        restaurant.cuisines?.some(cuisine => cuisine.toLowerCase().includes(query))
      );
    }

    if (selectedCuisine !== 'All') {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisines?.some(cuisine => 
          cuisine.toLowerCase().includes(selectedCuisine.toLowerCase())
        )
      );
    }

    setFilteredRestaurants(filtered);
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleViewMenu = (restaurantId: string) => {
    navigate(`/menu/${restaurantId}`);
  };

  const getAreaRestaurantCount = (areaName: string) => {
    return restaurants.filter(restaurant => {
      const address = restaurant.address;
      if (typeof address === 'string') {
        return address.toLowerCase().includes(areaName.toLowerCase());
      }
      return address?.area?.toLowerCase().includes(areaName.toLowerCase()) ||
             address?.street?.toLowerCase().includes(areaName.toLowerCase());
    }).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading Karachi restaurants map...</p>
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
            <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-4">
              🗺️ Restaurants Map - Karachi
            </h1>
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants in Karachi..."
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {cuisines.map((cuisine) => (
                  <Badge
                    key={cuisine}
                    variant={selectedCuisine === cuisine ? "default" : "outline"}
                    className={`cursor-pointer hover:bg-gray-700 transition-colors ${
                      selectedCuisine === cuisine 
                        ? 'bg-white text-black hover:bg-gray-200' 
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedCuisine(cuisine)}
                  >
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Area - Simulated with area cards */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    🏙️ Karachi Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {karachiAreas.map((area) => {
                      const restaurantCount = getAreaRestaurantCount(area.name);
                      return (
                        <div
                          key={area.name}
                          className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                          onClick={() => setSearchQuery(area.name)}
                        >
                          <h3 className="font-semibold text-white mb-1">{area.name}</h3>
                          <p className="text-sm text-gray-300">
                            📍 {area.lat.toFixed(4)}, {area.lng.toFixed(4)}
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            🍽️ {restaurantCount} restaurants
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Restaurant List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  Restaurants ({filteredRestaurants.length})
                </h2>
                
                {filteredRestaurants.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-gray-400">No restaurants found matching your criteria</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRestaurants.map((restaurant) => (
                      <Card
                        key={restaurant._id}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedRestaurant?._id === restaurant._id
                            ? 'bg-gray-700 border-white'
                            : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                        }`}
                        onClick={() => handleRestaurantClick(restaurant)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-white">{restaurant.name}</h3>
                            {restaurant.avg_rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-400">⭐</span>
                                <span className="text-sm text-white">
                                  {restaurant.avg_rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {restaurant.cuisines && restaurant.cuisines.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {restaurant.cuisines.slice(0, 2).map((cuisine, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-gray-600 text-gray-300">
                                  {cuisine}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="space-y-1 text-sm text-gray-400">
                            {restaurant.address && (
                              <div className="flex items-center gap-2">
                                <span>📍</span>
                                <span className="truncate">
                                  {typeof restaurant.address === 'string' 
                                    ? restaurant.address 
                                    : `${restaurant.address.area || restaurant.address.street || ''} Karachi`.trim()
                                  }
                                </span>
                              </div>
                            )}
                            {restaurant.phone && (
                              <div className="flex items-center gap-2">
                                <span>📞</span>
                                <span>{restaurant.phone}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Restaurant Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedRestaurant ? (
                <Card className="bg-gray-800 border-gray-700 sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      🍽️ {selectedRestaurant.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedRestaurant.description && (
                      <p className="text-gray-300 text-sm">
                        {selectedRestaurant.description}
                      </p>
                    )}

                    {selectedRestaurant.cuisines && selectedRestaurant.cuisines.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-2">Cuisines</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedRestaurant.cuisines.map((cuisine, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                              {cuisine}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 text-sm">
                      {selectedRestaurant.address && (
                        <div className="flex items-start gap-2">
                          <span>📍</span>
                          <span className="text-gray-300">
                            {typeof selectedRestaurant.address === 'string' 
                              ? selectedRestaurant.address 
                              : `${selectedRestaurant.address.street || ''} ${selectedRestaurant.address.area || ''} Karachi, Pakistan`.trim()
                            }
                          </span>
                        </div>
                      )}
                      {selectedRestaurant.phone && (
                        <div className="flex items-center gap-2">
                          <span>📞</span>
                          <span className="text-gray-300">{selectedRestaurant.phone}</span>
                        </div>
                      )}
                      {selectedRestaurant.avg_rating && (
                        <div className="flex items-center gap-2">
                          <span>⭐</span>
                          <span className="text-gray-300">
                            {selectedRestaurant.avg_rating.toFixed(1)} ({selectedRestaurant.review_count} reviews)
                          </span>
                        </div>
                      )}
                      {selectedRestaurant.price_range && (
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          <span className="text-gray-300">{selectedRestaurant.price_range}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => handleViewMenu(selectedRestaurant._id)}
                        className="w-full bg-white text-black hover:bg-gray-200"
                      >
                        🍽️ View Menu
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/search?q=${selectedRestaurant.name}`)}
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        🔍 Search Similar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">🗺️</div>
                    <h3 className="text-lg font-medium text-white mb-2">Select a Restaurant</h3>
                    <p className="text-gray-400 text-sm">
                      Click on any restaurant from the list to view details and location information.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
