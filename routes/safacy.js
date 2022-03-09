const express = require("express");

const safacyController = require("../controllers/safacyController");

const router = express.Router();

router.get("/:id", safacyController.getSafacyMsg);
router.put("/:id/message/update", safacyController.updateSafacyMsg);
router.put("/:id/location/update", safacyController.updateOriginLocation);
router.put("/:id/deslocation/update", safacyController.updateDeslocation);

module.exports = router;
