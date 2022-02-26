const express = require("express");

const profileController = require("../controllers/profileController");

const router = express.Router();

router.get("/", profileController.getProfile);
router.put("/:id/friend", profileController.addFriend);
router.put("/", profileController.acceptInvitation);

module.exports = router;
