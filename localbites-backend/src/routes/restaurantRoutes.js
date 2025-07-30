const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const { 
  searchRestaurants, 
  getRestaurants, 
  getRestaurant, 
  createRestaurant, 
  updateRestaurant, 
  deleteRestaurant 
} = require("../controllers/restaurantController");

// GET /api/restaurants/search
router.get("/search", searchRestaurants);

// GET /api/restaurants/geojson
router.get("/geojson", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    const geoJson = {
      type: "FeatureCollection",
      features: restaurants.map((r) => ({
        type: "Feature",
        geometry: r.location,
        properties: {
          name: r.name,
          description: r.description,
          id: r._id,
        },
      })),
    };
    res.json(geoJson);
  } catch (err) {
    res.status(500).json({ error: "GeoJSON fetch failed" });
  }
});

// GET /api/restaurants/nearby?lng=...&lat=...&radius=...
router.get("/nearby", async (req, res) => {
  const { lng, lat, radius = 5000 } = req.query;
  try {
    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      },
    });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: "Nearby search failed" });
  }
});

// GET /api/restaurants - Get all restaurants
router.get("/", getRestaurants);

// GET /api/restaurants/:idOrSlug - Get single restaurant
router.get("/:idOrSlug", getRestaurant);

// POST /api/restaurants - Create restaurant (protected)
router.post("/", createRestaurant);

// PUT /api/restaurants/:id - Update restaurant (protected)
router.put("/:id", updateRestaurant);

// DELETE /api/restaurants/:id - Delete restaurant (admin only)
router.delete("/:id", deleteRestaurant);

module.exports = router;
