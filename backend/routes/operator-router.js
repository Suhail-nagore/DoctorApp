const express = require("express");
const { 
  createOperator, 
  getAllOperators, 
  deleteOperator, 
  changePassword 
} = require("../controller/operator");

const router = express.Router();

router.post("/operators", createOperator);
router.get("/operators", getAllOperators);
router.delete("/operators/:id", deleteOperator);
router.put("/operators/:id/password", changePassword);

module.exports = router; 