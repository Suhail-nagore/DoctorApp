const express = require("express");
const checkAdminAuth = require("../middleware/checkAdminAuth");


const router = express.Router();




router.get("/checkauth", checkAdminAuth, (req, res) => {
  const user = req.user;

  // Remove sensitive data (e.g., password) for both operator and admin
  if (user && user.admin) {
      delete user.admin.password;
  }

  // Include the role and sanitized user information in the response
  res.status(200).json({
      success: true,
      message: "Authenticated user!",
      user: {
          ...user.admin,  // Include all admin fields except password
          role: user.role  // Add the role
      },
  });
});

module.exports = router;