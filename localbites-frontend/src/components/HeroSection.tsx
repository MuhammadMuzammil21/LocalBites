import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { Search, Send, Hand, Utensils, Coffee, MapPin, Pizza, ChefHat, Sandwich, Cake, Lightbulb, Map, Clock, Star } from "lucide-react";
import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() || location.trim()) {
      // Navigate to explore page with search parameters
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // You can reverse geocode this to get address
          setLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Location access denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault();
          // Focus on search input
          const searchInput = document.querySelector('input[placeholder*="Search for restaurants"]') as HTMLInputElement;
          searchInput?.focus();
          break;
        case 'l':
          e.preventDefault();
          // Focus on location input
          const locationInput = document.querySelector('input[placeholder*="Enter your location"]') as HTMLInputElement;
          locationInput?.focus();
          break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden pt-16" onKeyDown={handleKeyDown} tabIndex={-1}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-4">
          Glimpse Spots Nearby
        </h1>
        <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl">
          Discover and explore handpicked places by region.
        </p>

        {/* Main Search Bar */}
        <div className="w-full max-w-4xl mb-8">
          <div className="relative bg-white rounded-2xl p-1 border border-gray-300">
            <div className="bg-white rounded-xl flex items-center p-4">
              {/* Left side - What */}
              <div className="flex items-center flex-1">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <Utensils className="w-4 h-4 text-gray-600" />
                </div>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for restaurants, cafes, or food..."
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-gray-500 flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  aria-label="Search for food and restaurants"
                />
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-gray-300 mx-4"></div>

              {/* Right side - Where */}
              <div className="flex items-center flex-1">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location or address"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-gray-500 flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  aria-label="Enter your location"
                />
              </div>

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="ml-4 bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                aria-label="Search for restaurants and food"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Button 
              onClick={handleUseMyLocation}
              variant="outline" 
              size="sm" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/30 hover:border-white/40 hover:scale-105 backdrop-blur-sm transition-all duration-200"
              aria-label="Use my current location"
            >
              <MapPin className="w-3 h-3 mr-1" />
              Use My Location
            </Button>
            <Button 
              onClick={() => handleQuickSearch("popular restaurants")}
              variant="outline" 
              size="sm" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/30 hover:border-white/40 hover:scale-105 backdrop-blur-sm transition-all duration-200"
            >
              Popular Near Me
            </Button>
            <Button 
              onClick={() => handleQuickSearch("open now")}
              variant="outline" 
              size="sm" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/30 hover:border-white/40 hover:scale-105 backdrop-blur-sm transition-all duration-200"
            >
              Open Now
            </Button>
            <Button 
              onClick={() => handleQuickSearch("delivery")}
              variant="outline" 
              size="sm" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/30 hover:border-white/40 hover:scale-105 backdrop-blur-sm transition-all duration-200"
            >
              Delivery Available
            </Button>
          </div>
        </div>

        {/* Need a Hand Section */}
        <div className="flex items-center gap-4 mb-16">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-2 text-white cursor-pointer group">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Hand className="w-3 h-3 text-black" />
                </div>
                <span className="text-sm group-hover:text-gray-200 transition-colors">Need a Hand?</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-gray-900/95 backdrop-blur-sm border-gray-700 text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <h4 className="font-semibold text-white">Quick Tips</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Search className="w-3 h-3 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Search Smart</p>
                      <p className="text-xs text-gray-400">Use specific keywords like "pizza", "cafe", or "desserts" for better results</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Map className="w-3 h-3 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Location Matters</p>
                      <p className="text-xs text-gray-400">Enter your exact location or use "Use My Location" for nearby spots</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-3 h-3 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Check Hours</p>
                      <p className="text-xs text-gray-400">Use "Open Now" filter to find places currently serving</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="w-3 h-3 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Popular Picks</p>
                      <p className="text-xs text-gray-400">Try "Popular Near Me" to discover trending local favorites</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-xs text-gray-400">
                    💡 <span className="font-medium text-gray-300">Pro tip:</span> Use keyboard shortcuts ⌘K to search and ⌘L for location
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        {/* Category Icons */}
        <div className="flex gap-6 mb-8 flex-wrap justify-center">
          {/* Restaurant */}
          <div 
            onClick={() => handleQuickSearch("restaurant")}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-800 group-hover:border-white/50 group-hover:shadow-lg group-hover:shadow-white/10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                <Utensils className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="text-white text-sm font-medium group-hover:text-gray-200 transition-colors">Restaurant</span>
          </div>

          {/* Cafe */}
          <div 
            onClick={() => handleQuickSearch("cafe")}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-800 group-hover:border-white/50 group-hover:shadow-lg group-hover:shadow-white/10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                <Coffee className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="text-white text-sm font-medium group-hover:text-gray-200 transition-colors">Cafe</span>
          </div>

          {/* Fast Food */}
          <div 
            onClick={() => handleQuickSearch("fast food")}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-800 group-hover:border-white/50 group-hover:shadow-lg group-hover:shadow-white/10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                <Sandwich className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="text-white text-sm font-medium group-hover:text-gray-200 transition-colors">Fast Food</span>
          </div>

          {/* Pizza */}
          <div 
            onClick={() => handleQuickSearch("pizza")}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-800 group-hover:border-white/50 group-hover:shadow-lg group-hover:shadow-white/10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                <Pizza className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="text-white text-sm font-medium group-hover:text-gray-200 transition-colors">Pizza</span>
          </div>

          {/* Desserts */}
          <div 
            onClick={() => handleQuickSearch("desserts")}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-800 group-hover:border-white/50 group-hover:shadow-lg group-hover:shadow-white/10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                <Cake className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="text-white text-sm font-medium group-hover:text-gray-200 transition-colors">Desserts</span>
          </div>
        </div>
      </div>

      {/* Bottom Right Icon */}
      <div className="absolute bottom-4 right-4 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default HeroSection;
