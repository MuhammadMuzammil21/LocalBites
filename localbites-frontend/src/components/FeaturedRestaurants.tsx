import RestaurantCard from "./RestaurantCard";
import SectionHeader from "./SectionHeader";

// Dummy data for now
const featuredRestaurants = [
  {
    id: "1",
    name: "Mama's Kitchen",
    description: "Homestyle meals with love",
    image: "/assets/restaurant1.jpg",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Sushi Express",
    description: "Fresh sushi and sashimi",
    image: "/assets/restaurant2.jpg",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Taco Town",
    description: "Spicy tacos & street food vibes",
    image: "/assets/restaurant3.jpg",
    rating: 4.7,
  },
];

const FeaturedRestaurants = () => {
  return (
    <section className="px-6 md:px-16">
      <SectionHeader title="Featured Restaurants" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {featuredRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} {...restaurant} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
