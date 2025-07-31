import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface Restaurant {
  _id: string;
  name: string;
  description?: string;
  cuisines?: string[];
  address?: {
    street?: string;
    city?: string;
    country?: string;
    area?: string;
  } | string;
  phone?: string;
  avg_rating?: number;
  review_count?: number;
  is_verified?: boolean;
  price_range?: string;
}

interface RestaurantRecommendationsProps {
  recommendations: Restaurant[];
}

const RestaurantRecommendations = ({ recommendations }: RestaurantRecommendationsProps) => {
  const navigate = useNavigate();

  const handleViewMenu = (restaurantId: string) => {
    navigate(`/menu/${restaurantId}`);
  };

  const formatAddress = (address: any) => {
    if (typeof address === 'string') {
      return address;
    }
    if (address && typeof address === 'object') {
      return `${address.area || ''} ${address.city || 'Karachi'}`.trim();
    }
    return 'Karachi';
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Recommended for You
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Based on your order history and preferences
        </p>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🍽️</div>
            <p className="text-gray-400">No recommendations available</p>
            <p className="text-gray-500 text-sm mt-2">
              Order from more restaurants to get personalized recommendations
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((restaurant) => (
              <div key={restaurant._id} className="p-4 bg-gray-700 rounded-lg">
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-lg">
                      {restaurant.name}
                    </h3>
                    {restaurant.is_verified && (
                      <Badge className="bg-green-600 text-white text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  {restaurant.description && (
                    <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                      {restaurant.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    {restaurant.avg_rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-white text-sm">
                          {restaurant.avg_rating.toFixed(1)}
                        </span>
                        {restaurant.review_count && (
                          <span className="text-gray-400 text-sm">
                            ({restaurant.review_count})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mb-3">
                    {formatAddress(restaurant.address)}
                  </p>

                  {restaurant.cuisines && restaurant.cuisines.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {restaurant.cuisines.slice(0, 3).map((cuisine, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-gray-600 text-gray-300 text-xs"
                        >
                          {cuisine}
                        </Badge>
                      ))}
                      {restaurant.cuisines.length > 3 && (
                        <Badge 
                          variant="secondary" 
                          className="bg-gray-600 text-gray-300 text-xs"
                        >
                          +{restaurant.cuisines.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {restaurant.price_range && (
                    <p className="text-gray-400 text-sm mb-3">
                      Price Range: {restaurant.price_range}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleViewMenu(restaurant._id)}
                    className="flex-1 bg-white text-black hover:bg-gray-200"
                  >
                    View Menu
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/search')}
              className="border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              Explore More Restaurants
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantRecommendations;
