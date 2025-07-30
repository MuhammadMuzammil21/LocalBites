import HeroSection from '../components/HeroSection';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black">
      <Navbar />
      <HeroSection />
      
      {/* Browse All Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Restaurants
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our curated collection of restaurants, cafes, and eateries. 
            Find your next favorite dining spot with just a few clicks.
          </p>
          <Button 
            onClick={() => navigate('/search')}
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg rounded-lg transition-all duration-200 hover:scale-105"
          >
            Browse All Restaurants
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;