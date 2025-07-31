const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

// Get comprehensive admin statistics
const getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get total counts
    const [totalOrders, totalUsers, totalRestaurants] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: { $ne: 'ADMIN' } }),
      Restaurant.countDocuments()
    ]);

    // Get today's stats
    const [ordersToday, revenueToday] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ])
    ]);

    // Get total revenue
    const totalRevenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    // Get average order value
    const avgOrderValueResult = await Order.aggregate([
      { $group: { _id: null, avg: { $avg: "$totalAmount" } } }
    ]);

    // Get top restaurants
    const topRestaurants = await Order.aggregate([
      {
        $group: {
          _id: "$restaurant",
          revenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "_id",
          as: "restaurant"
        }
      },
      { $unwind: "$restaurant" }
    ]);

    const stats = {
      totalOrders,
      totalRevenue: totalRevenueResult[0]?.total || 0,
      totalRestaurants,
      totalUsers,
      ordersToday,
      revenueToday: revenueToday[0]?.total || 0,
      averageOrderValue: Math.round(avgOrderValueResult[0]?.avg || 0),
      topRestaurants
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics'
    });
  }
};

const getTotalOrders = async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayCount = await Order.countDocuments({ 
      createdAt: { $gte: today, $lt: tomorrow } 
    });

    res.json({ 
      success: true, 
      data: { total, today: todayCount } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching order statistics' 
    });
  }
};

const getTotalRevenue = async (req, res) => {
  try {
    const totalResult = await Order.aggregate([
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } }
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayResult = await Order.aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } }
    ]);

    res.json({ 
      success: true,
      data: {
        total: totalResult[0]?.revenue || 0,
        today: todayResult[0]?.revenue || 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching revenue statistics' 
    });
  }
};

const getOrdersByDate = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching orders by date' 
    });
  }
};

const getOrdersByStatus = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Order.countDocuments();
    const statusData = result.map(item => ({
      status: item._id,
      count: item.count,
      percentage: Math.round((item.count / total) * 100)
    }));

    res.json({ success: true, data: statusData });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching orders by status' 
    });
  }
};

const getTopRestaurants = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Order.aggregate([
      {
        $group: {
          _id: "$restaurant",
          revenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "_id",
          as: "restaurant"
        }
      },
      { $unwind: "$restaurant" }
    ]);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching top restaurants' 
    });
  }
};

module.exports = {
  getStats,
  getTotalOrders,
  getTotalRevenue,
  getOrdersByDate,
  getOrdersByStatus,
  getTopRestaurants,
};
