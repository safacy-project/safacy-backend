const mongoose = require("mongoose");
const { isEmail } = require("validator");

const SafacySchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    validate: [isEmail, "please enter valid Email"],
  },
  destination: {
    type: String,
    required: true,
  },
  radius: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  invitedFriendList: {
    type: Array,
    validate: [(val) => val.length < 4, "must have maximum 3 friends"],
  },
});

module.exports = mongoose.model("Safacy", SafacySchema);
