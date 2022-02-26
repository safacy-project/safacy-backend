const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signIn", authController.signIn);

module.exports = router;
