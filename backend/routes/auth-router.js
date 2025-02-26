const express = require("express");
const { OpLogin } = require("../controller/auth");


const router = express.Router();

router.post("/login",OpLogin)


module.exports = router;