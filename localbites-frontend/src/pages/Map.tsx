import RestaurantMap from "../components/map/Restaurantmap";

export default function MapPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Nearby Restaurants</h1>
      <RestaurantMap />
    </div>
  );
}
