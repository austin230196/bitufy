const mongoose = require("mongoose");


const adminSchema = new mongoose.Schema({
    btcAddress: {
        type: String,
        required: true
    },
    ethAddress: {
        type: String,
        required: false
    },
    totalUsers: {
        type: Number,
        required: false
    },
    verifiedUsers: {
        type: Number,
        required: false,
    },
    totalVolume: {
        type: Number,
        required: true
    },
}, {timestamps: true})


const AdminMeta = mongoose.model('AdminMeta', adminSchema)

module.exports =  AdminMeta;