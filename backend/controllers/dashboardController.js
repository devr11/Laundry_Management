const Order = require('../models/Order');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
    try {
        // Total number of orders
        const totalOrders = await Order.countDocuments();

        // Total revenue
        const revenueResult = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalBill' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // Orders count grouped by status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Format orders by status to be a nice object
        const statusCounts = {
            RECEIVED: 0,
            PROCESSING: 0,
            READY: 0,
            DELIVERED: 0
        };

        ordersByStatus.forEach(item => {
            if (statusCounts[item._id] !== undefined) {
                statusCounts[item._id] = item.count;
            }
        });

        res.status(200).json({
            totalOrders,
            totalRevenue,
            statusCounts
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats
};
