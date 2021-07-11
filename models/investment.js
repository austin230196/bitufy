const mongoose = require("mongoose");


const investmentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    deposited: {
        type: Boolean,
        required: true
    },
    confirmed: {
        type: Boolean,
        required: true
    },
    token: {
        type: String,
        required: false
    },
    plans: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    bonus: {
        type: Number,
        required: true
    },
    referral_bonus: {
        type: Number,
        required: true
    },
    investment_date: {
        type: String,
        required: false
    },
    cashout_date: {
        type: String,
        required: false
    },
    eligible: {
        type: Boolean,
        required: true
    },
    total_withdrawals: {
        type: Number,
        required: true
    },
}, {timestamps: true})


const Investment = mongoose.model('Investment', investmentSchema)

module.exports =  Investment;