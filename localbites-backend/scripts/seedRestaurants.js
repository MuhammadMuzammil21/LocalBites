const fs = require('fs');
const mongoose = require('mongoose');
const slugify = require('slugify'); // You might need to install this
require('dotenv').config();

const Restaurant = require('../src/models/Restaurant'); // Adjust the path if needed

const geojsonData = JSON.parse(
  fs.readFileSync('./scripts/karachi_restaurants.geojson', 'utf-8')
);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localbites');
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

const seedRestaurants = async () => {
  try {
    await connectDB();

    const features = geojsonData.features;

    const restaurants = features
      .filter((f) => f.geometry?.type === 'Point')
      .map((f, index) => {
        const name = f.properties?.name || `Restaurant ${index + 1}`;
        const cuisineRaw = f.properties?.cuisine;
        const cuisines = cuisineRaw ? cuisineRaw.split(';').map((c) => c.trim()) : [];

        return {
          name,
          slug: slugify(name, { lower: true }),
          description: 'Imported from OpenStreetMap.',
          cuisines,
          address: {
            street: f.properties?.['addr:street'] || 'Unknown Street',
            city: 'Karachi',
            country: 'Pakistan',
          },
          phone: '',
          website: '',
          hours: {},
          price_range: '$$',
          images: {
            cover: '',
            gallery: [],
          },
          location: {
            type: 'Point',
            coordinates: f.geometry.coordinates, // [lng, lat]
          },
          avg_rating: 0,
          review_count: 0,
          is_verified: false,
        };
      });

    await Restaurant.deleteMany({});
    await Restaurant.insertMany(restaurants);

    console.log(`✅ Inserted ${restaurants.length} restaurants.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedRestaurants();
