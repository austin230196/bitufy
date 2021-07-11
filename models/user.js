const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    other_names: {
        type: String,
        required: true
    },
    referredBy: {
        type: String,
        required: false
    },
    dob: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    authorization: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    v_token: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: false
    },
    v_tokenExpiration: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    refId: {
        type: String,
        required: true
    },
    referrals: {
        type: Number,
        required: true
    },
    bitcoin: {
        type: String,
        required: true
    },
    ethereum: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    country_code: {
        type: String,
        required: true
    },
    profile_complete: {
        type: Boolean,
        required: true
    },
    pin: {
        type: Number,
        required: false
    },
    country: {
        type: String,
        required: true
    }
}, {timestamps: true})


const User = mongoose.model("User", userSchema);

module.exports = User;