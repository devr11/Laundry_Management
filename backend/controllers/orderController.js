const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
    try {
        const { customerName, phoneNumber, garments } = req.body;

        if (!customerName || !phoneNumber || !garments || garments.length === 0) {
            res.status(400);
            throw new Error('Please provide all required fields and at least one garment');
        }

        // Calculate total bill
        let totalBill = 0;
        garments.forEach(g => {
            totalBill += g.quantity * g.pricePerItem;
        });

        // Generate unique order ID (LNDRY-Timestamp-Random)
        const orderId = `LNDRY-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

        // Set estimated delivery date (e.g., 3 days from now)
        const estimatedDeliveryDate = new Date();
        estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);

        const order = await Order.create({
            orderId,
            customerName,
            phoneNumber,
            garments,
            totalBill,
            estimatedDeliveryDate
        });

        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (with optional filters)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
    try {
        const { status, search } = req.query;
        let query = {};

        // Filter by status
        if (status) {
            query.status = status.toUpperCase();
        }

        // Search by customer name or phone number
        if (search) {
            query.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

        if (!status || !validStatuses.includes(status.toUpperCase())) {
            res.status(400);
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: status.toUpperCase() },
            { new: true, runValidators: true }
        );

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus
};
