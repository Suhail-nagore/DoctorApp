const mongoose = require("mongoose");
const PatientSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        age : {
            type : String,
            required : true
        },
        gender : {
            type : String,
            required : true

        },
        address : {
            type : String,
            required : true
        },
        phoneNo : {
            type : Number,
            required : true,
        },
    },
    {timestamps:true}
)
const patient = mongoose.model("Patient",PatientSchema);

module.exports = patient; 