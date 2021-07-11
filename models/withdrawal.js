const mongoose = require("mongoose");


const withdrawalSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    withdrawal_code: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    },
    confirmed: {
        type: Boolean,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
}, {timestamps: true})


const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema)

module.exports =  Withdrawal;