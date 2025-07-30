"use client";
import "../map/LeafletFix";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Restaurant } from "../../api/restaurantApi";
import { restaurantApi } from "../../api/restaurantApi";

interface RestaurantMapProps {
  restaurants?: Restaurant[];
}

export default function RestaurantMap({ restaurants }: RestaurantMapProps) {
  const [mapRestaurants, setMapRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    if (restaurants) {
      setMapRestaurants(restaurants);
    } else {
      // Load all restaurants if none provided
      loadAllRestaurants();
    }
  }, [restaurants]);

  const loadAllRestaurants = async () => {
    try {
      const allRestaurants = await restaurantApi.getAll();
      setMapRestaurants(allRestaurants);
    } catch (error) {
      console.error('Failed to load restaurants for map:', error);
    }
  };

  // Filter restaurants that have location data
  const restaurantsWithLocation = mapRestaurants.filter(
    restaurant => restaurant.location && restaurant.location.coordinates
  );

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden">
      <MapContainer center={[24.8607, 67.0011]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {restaurantsWithLocation.map((restaurant) => (
          <Marker
            key={restaurant._id}
            position={[
              restaurant.location!.coordinates[1], 
              restaurant.location!.coordinates[0]
            ]}
          >
            <Popup>
              <div className="p-2">
                <strong className="text-lg">{restaurant.name}</strong>
                {restaurant.description && (
                  <>
                    <br />
                    <span className="text-sm text-gray-600">{restaurant.description}</span>
                  </>
                )}
                {restaurant.cuisines && restaurant.cuisines.length > 0 && (
                  <>
                    <br />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {restaurant.cuisines.map((cuisine, index) => (
                        <span key={index} className="bg-gray-200 px-2 py-1 rounded text-xs">
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                {restaurant.address && (
                  <>
                    <br />
                    <span className="text-sm text-gray-500">{restaurant.address}</span>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
