import { Button } from '../components/ui/button';
import Navbar from '../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Discover Karachi's Best <span className="text-gray-300">Restaurants</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Explore handpicked restaurants, cafes, and eateries across Karachi. 
            Find your next favorite dining spot with just a few clicks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/search')}
              className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg rounded-lg transition-all duration-200 hover:scale-105"
            >
              Browse Restaurants
            </Button>
            <Button 
              onClick={() => navigate('/map')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg rounded-lg transition-all duration-200 hover:scale-105"
            >
              View Map
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Why Choose LocalBites?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-white mb-3">Curated Selection</h3>
              <p className="text-gray-400">
                Handpicked restaurants and cafes across Karachi, ensuring quality and authenticity.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-white mb-3">Location Based</h3>
              <p className="text-gray-400">
                Find restaurants near you with our interactive map and location-based search.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-white mb-3">Verified Reviews</h3>
              <p className="text-gray-400">
                Authentic reviews from real customers to help you make the best dining choices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Explore Karachi's Food Scene?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of food lovers discovering the best restaurants in Karachi.
          </p>
          
          <Button 
            onClick={() => navigate('/search')}
            className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg rounded-lg transition-all duration-200 hover:scale-105"
          >
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
