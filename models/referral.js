const mongoose = require("mongoose");


const referralSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    referrals: [
    {
        username: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        regDate: {
            type: Date,
            default: () => Date.now(),
            required: true
        },
        confirmed: {
            type: Boolean,
            required: true
        },
        deposited: {
            type: Boolean,
            required: true
        }
    }
    ]
}, {timestamps: true})


const Referral = mongoose.model('Referral', referralSchema)

module.exports =  Referral;