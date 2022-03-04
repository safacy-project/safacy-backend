const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

const {
  createSafacyInputValidators,
  addNewFriendInputValidators,
  validate,
} = require("../middlewares/inputValidation");

router.get("/:id", userController.getUserInfo);
router.post(
  "/:id/new",
  validate(createSafacyInputValidators),
  userController.createSafacy
);

router.put("/:id/public", userController.startPublicMode);
router.put("/:id/privacy", userController.stopPublicMode);

router.get("/current/:id", userController.getCurrentSafacy);

router.put(
  "/:id/friend/new",
  validate(addNewFriendInputValidators),
  userController.addNewFriend
);
router.put("/:id/friend/invitation", userController.acceptFriendInvitation);

module.exports = router;
