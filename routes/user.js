const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router.get("/:id", userController.getUserInfo);
router.put("/:id/public", userController.startPublicMode);
router.post("/:id/new", userController.createSafacy);
router.get("/current/:id", userController.getCurrentSafacy);
router.put("/:id/privacy", userController.stopPublicMode);
router.get("/:id/friendList", userController.getPublicModeFrinedList);

module.exports = router;
