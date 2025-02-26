const mongoose = require("mongoose");

const OperatorSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        required: true,
        unique: true,  // Ensure usernames are unique
      },
      password: {
        type: String,
        required: true,
      },
    }
);

const Operator = mongoose.model("operator", OperatorSchema);

module.exports = Operator;
