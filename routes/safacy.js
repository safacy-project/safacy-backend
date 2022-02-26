const express = require("express");

const safacyController = require("../controllers/safacyController");

const router = express.Router();

router.get("/:id", safacyController.getUserInfo);
router.put("/:id/public", safacyController.startPublicMode);
router.post("/:id/new", safacyController.createSafacy);
router.get("/current/:id", safacyController.getCurrentSafacy);
router.put("/:id/privacy", safacyController.stopPublicMode);

module.exports = router;
