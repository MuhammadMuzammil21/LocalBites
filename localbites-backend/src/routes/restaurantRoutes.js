const express = require('express');
const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  getNearbyRestaurants,
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Public routes
router.get('/', getRestaurants);
router.get('/search', searchRestaurants);
router.get('/nearby', getNearbyRestaurants);

// GeoJSON endpoint for map integration
router.get('/geojson', asyncHandler(async (req, res) => {
  const Restaurant = require('../models/Restaurant');
  
  const restaurants = await Restaurant.find({})
    .select('name description location _id cuisines avg_rating')
    .limit(1000); // Limit for performance

  const geoJson = {
    type: "FeatureCollection",
    features: restaurants.map((r) => ({
      type: "Feature",
      geometry: r.location,
      properties: {
        id: r._id,
        name: r.name,
        description: r.description,
        cuisines: r.cuisines,
        rating: r.avg_rating,
      },
    })),
  };

  res.json({
    success: true,
    data: geoJson
  });
}));

router.get('/:idOrSlug', getRestaurant);

// Protected routes - only apply protection to specific routes
router.post('/', protect, authorize('OWNER', 'ADMIN'), createRestaurant);
router.put('/:id', protect, authorize('OWNER', 'ADMIN'), updateRestaurant);
router.delete('/:id', protect, authorize('ADMIN'), deleteRestaurant);

module.exports = router;
