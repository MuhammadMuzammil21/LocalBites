const fs = require('fs');
const mongoose = require('mongoose');
const slugify = require('slugify');
const path = require('path');
require('dotenv').config();

const Restaurant = require('../src/models/Restaurant');

// Karachi-specific restaurant data with better variety
const karachiRestaurants = [
  {
    name: 'Karachi Biryani House',
    cuisines: ['Pakistani', 'Biryani'],
    coordinates: [67.0011, 24.8607], // Saddar
    area: 'Saddar'
  },
  {
    name: 'Cafe Flo',
    cuisines: ['Continental', 'Cafe'],
    coordinates: [67.0648, 24.8138], // Clifton
    area: 'Clifton'
  },
  {
    name: 'Kolachi Restaurant',
    cuisines: ['Pakistani', 'BBQ'],
    coordinates: [67.0648, 24.8138], // Do Darya
    area: 'Do Darya'
  },
  {
    name: 'Xanders',
    cuisines: ['Continental', 'Fast Food'],
    coordinates: [67.0648, 24.8138], // Clifton
    area: 'Clifton'
  },
  {
    name: 'Okra',
    cuisines: ['Pakistani', 'Fine Dining'],
    coordinates: [67.0648, 24.8138], // Clifton
    area: 'Clifton'
  },
  {
    name: 'Cafe Aylanto',
    cuisines: ['Continental', 'Mediterranean'],
    coordinates: [67.0648, 24.8138], // Clifton
    area: 'Clifton'
  },
  {
    name: 'Sakura Japanese Restaurant',
    cuisines: ['Japanese', 'Sushi'],
    coordinates: [67.0648, 24.8138], // Clifton
    area: 'Clifton'
  },
  {
    name: 'Pompei Italian Restaurant',
    cuisines: ['Italian', 'Pizza'],
    coordinates: [67.0648, 24.8138], // Clifton
    area: 'Clifton'
  },
  {
    name: 'Nando\'s',
    cuisines: ['Portuguese', 'Chicken'],
    coordinates: [67.0648, 24.8138], // Clifton
    area: 'Clifton'
  },
  {
    name: 'KFC',
    cuisines: ['Fast Food', 'Chicken'],
    coordinates: [67.0011, 24.8607], // Saddar
    area: 'Saddar'
  },
  {
    name: 'McDonald\'s',
    cuisines: ['Fast Food', 'Burgers'],
    coordinates: [67.0011, 24.8607], // Saddar
    area: 'Saddar'
  },
  {
    name: 'Pizza Hut',
    cuisines: ['Pizza', 'Fast Food'],
    coordinates: [67.0011, 24.8607], // Saddar
    area: 'Saddar'
  },
  {
    name: 'Subway',
    cuisines: ['Fast Food', 'Sandwiches'],
    coordinates: [67.0648, 24.8138], // Clifton
    area: 'Clifton'
  },
  {
    name: 'Hardee\'s',
    cuisines: ['Fast Food', 'Burgers'],
    coordinates: [67.0648, 24.8138], // Clifton
    area: 'Clifton'
  },
  {
    name: 'Dunkin\' Donuts',
    cuisines: ['Cafe', 'Desserts'],
    coordinates: [67.0648, 24.8138], // Clifton
    area: 'Clifton'
  }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/localbites', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const generateDescription = (name, cuisines, area) => {
  if (cuisines.length === 0) {
    return `Experience authentic flavors at ${name} in ${area}, Karachi`;
  }
  const cuisineList = cuisines.slice(0, 2).join(' & ');
  return `Serving delicious ${cuisineList} cuisine at ${name} in ${area}, Karachi`;
};

const seedRestaurants = async () => {
  try {
    console.log('🌱 Starting restaurant seeding process...');
    await connectDB();

    // Check if GeoJSON file exists, otherwise use default data
    let restaurantData = karachiRestaurants;
    
    const geojsonPath = path.join(__dirname, 'karachi_restaurants.geojson');
    if (fs.existsSync(geojsonPath)) {
      console.log('📁 Found GeoJSON file, using external data...');
      const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, 'utf-8'));
      
      restaurantData = geojsonData.features
        .filter((f) => f.geometry?.type === 'Point')
        .map((f, index) => {
          const name = f.properties?.name || `Restaurant ${index + 1}`;
          const cuisineRaw = f.properties?.cuisine;
          const cuisines = cuisineRaw ? cuisineRaw.split(';').map((c) => c.trim()) : ['Pakistani'];
          
          return {
            name,
            cuisines,
            coordinates: f.geometry.coordinates,
            area: f.properties?.area || 'Karachi'
          };
        });
    } else {
      console.log('📁 GeoJSON file not found, using default Karachi restaurants...');
    }

    const restaurants = restaurantData.map((data, index) => {
      const uniqueSlug = `${slugify(data.name, { lower: true })}-${index}`;
      
      return {
        name: data.name,
        slug: uniqueSlug,
        description: generateDescription(data.name, data.cuisines, data.area),
        cuisines: data.cuisines,
        address: {
          street: `Street ${index + 1}`,
          city: 'Karachi',
          country: 'Pakistan',
          area: data.area
        },
        phone: `+92-21-${Math.floor(Math.random() * 9000000) + 1000000}`,
        website: '',
        hours: {
          monday: ['11:00-23:00'],
          tuesday: ['11:00-23:00'],
          wednesday: ['11:00-23:00'],
          thursday: ['11:00-23:00'],
          friday: ['11:00-23:00'],
          saturday: ['11:00-23:00'],
          sunday: ['11:00-23:00']
        },
        price_range: ['$', '$$', '$$$'][Math.floor(Math.random() * 3)],
        images: {
          cover: '',
          gallery: [],
        },
        location: {
          type: 'Point',
          coordinates: data.coordinates, // [lng, lat]
        },
        avg_rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
        review_count: Math.floor(Math.random() * 100) + 10,
        is_verified: Math.random() > 0.3, // 70% verified
      };
    });

    // Clear existing data
    console.log('🗑️  Clearing existing restaurants...');
    await Restaurant.deleteMany({});

    // Insert new data
    console.log('📝 Inserting new restaurants...');
    const insertedRestaurants = await Restaurant.insertMany(restaurants);

    console.log(`✅ Successfully inserted ${insertedRestaurants.length} restaurants into the database`);
    console.log('🏙️  All restaurants are located in Karachi, Pakistan');
    
    // Display summary
    const cuisineCount = {};
    restaurants.forEach(r => {
      r.cuisines.forEach(c => {
        cuisineCount[c] = (cuisineCount[c] || 0) + 1;
      });
    });
    
    console.log('📊 Cuisine distribution:');
    Object.entries(cuisineCount).forEach(([cuisine, count]) => {
      console.log(`   ${cuisine}: ${count} restaurants`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    console.error('Stack trace:', err.stack);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⚠️  Seeding interrupted by user');
  mongoose.connection.close();
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Start seeding
seedRestaurants();
