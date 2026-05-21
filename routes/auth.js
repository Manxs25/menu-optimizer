const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.post("/register", authController.register);
router.post("/login", authController.login);



module.exports = router;