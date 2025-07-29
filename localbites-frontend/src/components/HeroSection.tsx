import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20 bg-gradient-to-b from-orange-100 to-white">
      <h1 className="text-4xl md:text-6xl font-bold text-orange-600">
        Welcome to LocalBites 🍽️
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Discover the best local food near you
      </p>
      <Button
        className="mt-6 text-white bg-orange-500 hover:bg-orange-600"
        onClick={() => navigate("/explore")}
      >
        Explore Restaurants
      </Button>
    </div>
  );
};

export default HeroSection;
