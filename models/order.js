const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    },
    amount: {
        type: String,
        required: true
    },
    from: {
        type: String, 
        required: true
    },
    to: {
        type: String, 
        required: true
    }
}, {timestamps: true})


const Order = mongoose.model("Order", orderSchema)


module.exports = Order;