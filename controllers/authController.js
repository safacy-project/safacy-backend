const User = require("../models/User");

const signIn = async (req, res, next) => {
  const { email, nickname } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      await User.create({
        email,
        nickname,
      });
    }

    res.json({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    });
  } catch (err) {
    res.json({
      error: {
        message: "Invalid Server Error",
        code: 500,
      },
    });
  }
};

exports.signIn = signIn;
