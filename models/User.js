const mongoose = require("mongoose");
const { isEmail } = require("validator");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [isEmail, "please enter a valid Email"],
  },
  nickname: {
    type: String,
    required: true,
  },
  publicMode: {
    type: Boolean,
    default: false,
  },
  myFriendList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendInvitationList: {
    type: Array,
  },
  safacyHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Safacy",
    },
  ],
  safacyInvitationList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
