const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Return all restaurants in GeoJSON format
router.get('/geojson', async (req, res) => {
  const restaurants = await Restaurant.find();

  const geoJson = {
    type: "FeatureCollection",
    features: restaurants.map(r => ({
      type: "Feature",
      geometry: r.location,
      properties: {
        id: r._id,
        name: r.name,
        category: r.category,
      },
    })),
  };

  res.json(geoJson);
});

// Nearby search
router.get('/nearby', async (req, res) => {
  const { lng, lat, radius } = req.query;

  const restaurants = await Restaurant.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseInt(radius) || 5000,
      },
    },
  });

  res.json(restaurants);
});

module.exports = router;
