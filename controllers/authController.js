const User = require("../models/User");

const signIn = async (req, res, next) => {
  try {
    console.log("something");
  } catch (err) {
    console.log(err);
  }
};

exports.signIn = signIn;
