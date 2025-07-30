// src/components/RestaurantGrid.tsx

import { useState, useEffect } from "react";
import RestaurantCard from "./RestaurantCard";
import { restaurantApi, Restaurant } from "../api/restaurantApi";
import { toast } from "sonner";

interface Props {
  selectedCategory: string;
}

export default function RestaurantGrid({ selectedCategory }: Props) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantApi.getAll();
        setRestaurants(data);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
        toast.error('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filtered = selectedCategory === "All"
    ? restaurants
    : restaurants.filter(r => 
        r.cuisines?.some(cuisine => 
          cuisine.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );

  if (loading) {
    return (
      <section className="px-4 md:px-16 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-3 rounded w-2/3"></div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="px-4 md:px-16 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filtered.map((restaurant) => (
        <RestaurantCard 
          key={restaurant._id}
          id={restaurant._id}
          name={restaurant.name}
          description={restaurant.description || ''}
          rating={restaurant.avg_rating || 0}
          image={restaurant.images?.cover || '/assets/restaurant1.jpg'}
        />
      ))}
    </section>
  );
}
