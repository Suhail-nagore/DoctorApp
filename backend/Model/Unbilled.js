const mongoose = require("mongoose");

const UnbilledSchema = new mongoose.Schema(
    {
        serialNo: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        age: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true,
        },
        referredBy: {
            type: mongoose.Schema.Types.Mixed,
            ref: "doctors",
            required: true
        },
        category: {
            type: String,
            required: true
        },
        subcategory: {
            type: String,
            required: true
        },
        fees: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        finalPayment: {
            type: Number,
            required: true
        },
        paymentMode: {
            type: String,
            required: true
        },
        referralFee: {
            type: Number,
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Unbilled", UnbilledSchema); 