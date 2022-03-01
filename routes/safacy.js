const express = require("express");

const safacyController = require("../controllers/safacyController");

const router = express.Router();

router.post("/:id", safacyController.getPublicModeFrinedList);

module.exports = router;
