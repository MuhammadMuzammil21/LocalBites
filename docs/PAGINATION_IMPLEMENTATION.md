# Pagination Implementation for LocalBites

## Overview
This document explains the pagination implementation added to the LocalBites frontend to handle the backend's paginated restaurant data.

## Problem Solved
The backend was implementing pagination (limiting to 20 restaurants per page) but the frontend was only showing the first page of results, making it appear as if only 20 restaurants were available even when the database contained many more.

## Implementation Details

### 1. Pagination Component (`src/components/ui/pagination.tsx`)
- Custom pagination component built with Tailwind CSS
- Provides navigation controls: Previous, Next, page numbers, and ellipsis
- Responsive design with proper accessibility attributes
- Clean black and white styling to match the app theme

### 2. Updated Restaurant Grid (`src/components/RestaurantGrid.tsx`)
**Key Changes:**
- Added pagination state management
- Implemented `fetchRestaurants()` function with page parameter
- Added `handlePageChange()` for navigation
- Integrated pagination component at the bottom
- Shows pagination info (e.g., "Showing 1 to 20 of 150 restaurants")
- Smooth scroll to top when changing pages

**Features:**
- Maintains category filtering across pages
- Loading states during page transitions
- Proper error handling
- Responsive pagination controls

### 3. Updated Search Results (`src/pages/SearchResults.tsx`)
**Key Changes:**
- Added pagination support to search functionality
- URL parameter management for page state
- Integrated with existing search and filter functionality
- Maintains search query and filters across page changes

**Features:**
- Search results pagination
- URL-based page state (shareable links)
- Filter and search state preservation
- Responsive design

### 4. Updated Restaurant API (`src/api/restaurantApi.ts`)
**Key Changes:**
- Updated `search()` method to return `ApiResponse<Restaurant[]>`
- Proper handling of pagination metadata
- Backward compatibility with old API responses
- Type safety improvements

## Usage

### Basic Pagination
```typescript
const [currentPage, setCurrentPage] = useState(1);
const [pagination, setPagination] = useState({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
});

const fetchData = async (page: number) => {
  const response = await restaurantApi.getAll(page, 20);
  setRestaurants(response.data);
  setPagination(response.pagination);
};
```

### Pagination Component Usage
```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
    </PaginationItem>
    
    {/* Page numbers */}
    <PaginationItem>
      <PaginationLink onClick={() => handlePageChange(1)} isActive={page === 1}>
        1
      </PaginationLink>
    </PaginationItem>
    
    <PaginationItem>
      <PaginationNext onClick={() => handlePageChange(page + 1)} />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

## Backend API Response Format

The backend returns paginated data in this format:
```json
{
  "success": true,
  "data": [...], // Array of restaurants
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## User Experience Improvements

1. **Navigation**: Users can now browse through all restaurants, not just the first 20
2. **Performance**: Only loads 20 restaurants at a time, improving page load speed
3. **State Management**: Page state is preserved in URL for shareable links
4. **Smooth Transitions**: Scroll to top when changing pages
5. **Loading States**: Clear feedback during page transitions
6. **Responsive Design**: Works well on all device sizes

## Testing

To test the pagination:
1. Start the backend server with seeded restaurant data
2. Navigate to the home page or search results
3. Verify pagination controls appear when there are multiple pages
4. Test navigation between pages
5. Verify URL updates with page parameter
6. Test filtering and search with pagination

## Future Enhancements

1. **Infinite Scroll**: Option for infinite scroll instead of pagination
2. **Page Size Selection**: Allow users to choose items per page (10, 20, 50)
3. **Jump to Page**: Direct page number input
4. **Keyboard Navigation**: Arrow key support for page navigation
5. **Performance**: Implement caching for previously loaded pages

## Files Modified

- `src/components/ui/pagination.tsx` (new)
- `src/components/RestaurantGrid.tsx` (updated)
- `src/pages/SearchResults.tsx` (updated)
- `src/api/restaurantApi.ts` (updated)

## Dependencies

No additional dependencies were required. The implementation uses:
- React hooks (useState, useEffect)
- React Router (useSearchParams)
- Existing UI components
- Tailwind CSS for styling
