const Operator = require("../Model/Operator");
const bcrypt = require("bcryptjs");

const createOperator = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if operator already exists
    const existingOperator = await Operator.findOne({ username });
    if (existingOperator) {
      return res.status(400).json({ message: "Operator already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new operator
    const operator = new Operator({
      username,
      password: hashedPassword,
    });

    await operator.save();
    res.status(201).json({ message: "Operator created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating operator" });
  }
};

const getAllOperators = async (req, res) => {
  try {
    const operators = await Operator.find({}, { password: 0 });
    res.json(operators);
  } catch (error) {
    res.status(500).json({ message: "Error fetching operators" });
  }
};

const deleteOperator = async (req, res) => {
  try {
    await Operator.findByIdAndDelete(req.params.id);
    res.json({ message: "Operator deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting operator" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await Operator.findByIdAndUpdate(req.params.id, {
      password: hashedPassword
    });
    
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password" });
  }
};

module.exports = {
  createOperator,
  getAllOperators,
  deleteOperator,
  changePassword
}; 