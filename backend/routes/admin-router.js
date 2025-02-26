const express = require("express");
const { AdminLogin, changeAdminPassword } = require("../controller/admin");


const router = express.Router();

router.post("/login",AdminLogin)
router.put("/change-password", changeAdminPassword);


module.exports = router;