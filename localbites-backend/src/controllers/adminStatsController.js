const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

const getTotalOrders = async (req, res) => {
  const total = await Order.countDocuments();
  res.json({ totalOrders: total });
};

const getTotalRevenue = async (req, res) => {
  const result = await Order.aggregate([
    { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
  ]);
  res.json({ totalRevenue: result[0]?.revenue || 0 });
};

const getOrdersByDate = async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  res.json(result);
};

const getOrdersByStatus = async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);
  res.json(result);
};

const getTopRestaurants = async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: "$restaurant",
        totalRevenue: { $sum: "$totalPrice" },
        orderCount: { $sum: 1 }
      }
    },
    {
      $sort: { totalRevenue: -1 }
    },
    { $limit: 5 },
    {
      $lookup: {
        from: "restaurants",
        localField: "_id",
        foreignField: "_id",
        as: "restaurantInfo"
      }
    },
    {
      $unwind: "$restaurantInfo"
    },
    {
      $project: {
        name: "$restaurantInfo.name",
        totalRevenue: 1,
        orderCount: 1
      }
    }
  ]);
  res.json(result);
};

module.exports = {
  getTotalOrders,
  getTotalRevenue,
  getOrdersByDate,
  getOrdersByStatus,
  getTopRestaurants,
};
