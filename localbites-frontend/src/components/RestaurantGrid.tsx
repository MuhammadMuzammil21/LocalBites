// src/components/RestaurantGrid.tsx

import { useState, useEffect } from "react";
import RestaurantCard from "./RestaurantCard";
import { restaurantApi, Restaurant, ApiResponse } from "../api/restaurantApi";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  selectedCategory: string;
}

export default function RestaurantGrid({ selectedCategory }: Props) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const fetchRestaurants = async (page: number = 1) => {
    try {
      setLoading(true);
      const response: ApiResponse<Restaurant[]> = await restaurantApi.getAll(page, 20);
      setRestaurants(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = selectedCategory === "All"
    ? restaurants
    : restaurants.filter(r => 
        r.cuisines?.some(cuisine => 
          cuisine.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );

  if (loading) {
    return (
      <section className="px-4 md:px-16 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
    <section className="px-4 md:px-16 py-8">
      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
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
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-sm text-gray-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} restaurants
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                  className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                  className={pagination.page === pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  );
}
