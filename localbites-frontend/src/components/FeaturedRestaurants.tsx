import { useState, useEffect } from "react";
import RestaurantCard from "./RestaurantCard";
import SectionHeader from "./SectionHeader";
import { restaurantApi, Restaurant } from "../api/restaurantApi";
import { toast } from "sonner";

const FeaturedRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantApi.getAll();
        // Take first 6 restaurants as featured
        setRestaurants(data.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
        toast.error('Failed to load featured restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <section className="px-6 md:px-16">
        <SectionHeader title="Featured Restaurants" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-16">
      <SectionHeader title="Featured Restaurants" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard 
            key={restaurant._id} 
            id={restaurant._id}
            name={restaurant.name}
            description={restaurant.description || ''}
            rating={restaurant.avg_rating || 0}
            image={restaurant.images?.cover || '/assets/restaurant1.jpg'}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
