import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import { restaurantApi, ApiResponse } from '../api/restaurantApi';
import type { Restaurant } from '../api/restaurantApi';
import { Search, MapPin, BarChart3, ChevronDown, Star, Phone, DollarSign, Loader2 } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || '');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const cuisines = [
    'All', 'Pakistani', 'Chinese', 'Italian', 'Fast Food', 
    'Burgers', 'Pizza', 'Desserts', 'Cafe', 'Seafood'
  ];

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleSearch = async (page: number = currentPage) => {
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('q', searchQuery);
    if (location) newParams.set('location', location);
    if (selectedCuisine && selectedCuisine !== 'All') newParams.set('cuisine', selectedCuisine);
    if (page > 1) newParams.set('page', page.toString());

    setSearchParams(newParams);
    setLoading(true);

    try {
      const response: ApiResponse<Restaurant[]> = await restaurantApi.search({
        q: searchQuery,
        location,
        cuisine: selectedCuisine !== 'All' ? selectedCuisine : undefined,
        page,
        limit: 20
      });
      
      setRestaurants(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch search results');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCuisineFilter = (cuisine: string) => {
    setSelectedCuisine(cuisine);
    setCurrentPage(1); // Reset to first page when filtering
    const newParams = new URLSearchParams(searchParams);
    if (cuisine === 'All') {
      newParams.delete('cuisine');
    } else {
      newParams.set('cuisine', cuisine);
    }
    newParams.delete('page'); // Remove page when filtering
    setSearchParams(newParams);
    
    // Trigger new search with updated cuisine filter
    setTimeout(() => handleSearch(1), 100);
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return (b.avg_rating || 0) - (a.avg_rating || 0);
      default:
        return 0;
    }
  });

  const handleRestaurantClick = (restaurant: Restaurant) => {
    navigate(`/menu/${restaurant._id}`);
  };

  const renderPaginationItems = () => {
    const items = [];
    const { page, pages } = pagination;
    
    // Always show first page
    if (pages > 0) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={page === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if there's a gap
    if (page > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={page === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if there's a gap
    if (page < pages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page (if more than 1 page)
    if (pages > 1) {
      items.push(
        <PaginationItem key={pages}>
          <PaginationLink
            onClick={() => handlePageChange(pages)}
            isActive={page === pages}
          >
            {pages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Main content with top padding for navbar */}
      <div className="pt-16">
        {/* Search Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Inputs */}
              <div className="flex-1 flex gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search size={16} />
                  </div>
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for restaurants, food..."
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:bg-gray-700"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <MapPin size={16} />
                  </div>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location in Karachi"
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:bg-gray-700"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                  />
                </div>
                <Button onClick={() => handleSearch(1)} className="px-6 bg-white text-black hover:bg-gray-200">
                  Search
                </Button>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-700 rounded-md px-3 py-2 text-sm bg-gray-800 text-white"
                >
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-3">
              <ChevronDown size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Cuisine:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant={selectedCuisine === cuisine ? "default" : "outline"}
                  className={`cursor-pointer hover:bg-gray-700 transition-colors ${
                    selectedCuisine === cuisine 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                  onClick={() => handleCuisineFilter(cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              {pagination.total || restaurants.length} restaurant{(pagination.total || restaurants.length) !== 1 ? 's' : ''} found in Karachi
            </h2>
            {searchQuery && (
              <p className="text-gray-400 mt-1">
                Results for "{searchQuery}"
                {location && ` near ${location}`}
              </p>
            )}
            {pagination.total > 0 && (
              <p className="text-gray-400 text-sm mt-1">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </p>
            )}
          </div>

          {loading ? (
            <div className="text-center text-white py-10">
              <Loader2 className="inline-block w-8 h-8 animate-spin mb-4" />
              <p>Loading restaurants...</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-12">
              <Search size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-white mb-2">No restaurants found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or explore different areas of Karachi</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {sortedRestaurants.map((restaurant) => (
                  <Card
                    key={restaurant._id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gray-800 border-gray-700 hover:border-gray-600 hover:scale-105"
                    onClick={() => handleRestaurantClick(restaurant)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold text-white">
                          {restaurant.name}
                        </CardTitle>
                        {restaurant.avg_rating && (
                          <div className="flex items-center gap-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-white">
                              {restaurant.avg_rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {restaurant.description && (
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {restaurant.description}
                        </p>
                      )}
                      
                      {restaurant.cuisines && restaurant.cuisines.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {restaurant.cuisines.slice(0, 3).map((cuisine, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              {cuisine}
                            </Badge>
                          ))}
                          {restaurant.cuisines.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              +{restaurant.cuisines.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="space-y-2 text-sm text-gray-400">
                        {restaurant.address && (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span className="truncate">
                              {typeof restaurant.address === 'string' 
                                ? restaurant.address 
                                : `${restaurant.address.street || ''} ${restaurant.address.city || 'Karachi'} ${restaurant.address.country || 'Pakistan'}`.trim()
                              }
                            </span>
                          </div>
                        )}
                        {restaurant.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>{restaurant.phone}</span>
                          </div>
                        )}
                        {restaurant.price_range && (
                          <div className="flex items-center gap-2">
                            <DollarSign size={14} />
                            <span>{restaurant.price_range}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex flex-col items-center space-y-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                          className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer text-white hover:text-black"}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                          className={pagination.page === pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer text-white hover:text-black"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
