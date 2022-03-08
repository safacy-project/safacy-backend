const express = require("express");

const safacyController = require("../controllers/safacyController");

const router = express.Router();

router.get("/:id", safacyController.getSafacyMsg);
router.put("/:id/update", safacyController.updateSafacyMsg);

module.exports = router;
