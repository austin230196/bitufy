const mongoose = require("mongoose");


const depositSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    deposit_code: {
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


const Deposit = mongoose.model('Deposit', depositSchema)

module.exports =  Deposit;