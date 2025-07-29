import { useEffect, useState } from 'react';
import { fetchRestaurants } from '../api/restaurantApi';

type Restaurant = {
  _id: string;
  name: string;
  description?: string;
  address?: string;
  imageUrl?: string;
};

const Home = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching restaurants...');
    fetchRestaurants()
      .then(data => {
        console.log('Restaurants fetched:', data);
        setRestaurants(data);
      })
      .catch(error => {
        console.error('Failed to fetch restaurants:', error);
        setRestaurants([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to LocalBites 🍔</h1>
      <p className="text-gray-600 text-center mb-10">Find the best local restaurants near you!</p>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : restaurants.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">No restaurants found</p>
          <p className="text-sm text-gray-400">Try adding some restaurants to your database</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {restaurants.map(restaurant => (
            <div key={restaurant._id} className="bg-white rounded-xl shadow-md p-4 hover:scale-[1.02] transition-all duration-300">
              {restaurant.imageUrl && (
                <img src={restaurant.imageUrl} alt={restaurant.name} className="h-40 w-full object-cover rounded-lg mb-3" />
              )}
              <h2 className="text-xl font-semibold">{restaurant.name}</h2>
              <p className="text-gray-500 text-sm">{restaurant.description}</p>
              <p className="text-gray-400 text-xs mt-2">{restaurant.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
