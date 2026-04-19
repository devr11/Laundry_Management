const mongoose = require('mongoose');

const garmentSchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g. Shirt, Pants, Blanket
    quantity: { type: Number, required: true, min: 1 },
    pricePerItem: { type: Number, required: true, min: 0 }
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    },
    customerName: {
        type: String,
        required: [true, 'Please provide customer name']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide phone number']
    },
    garments: [garmentSchema],
    totalBill: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'],
        default: 'RECEIVED'
    },
    estimatedDeliveryDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
