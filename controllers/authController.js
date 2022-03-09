const User = require("../models/User");
const Safacy = require("../models/Safacy");

const { RESPONSE_MESSAGE } = require("../constants");

const signIn = async (req, res) => {
  const { email, nickname } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      await User.create({
        email,
        nickname,
      });

      await Safacy.create({
        user: email,
        publicMode: false,
        destination: "",
        radius: 50,
        time: 30,
        invitedFriendList: [],
        safacyBotMsg: [],
        originLocation: [],
        userDestination: [],
        desLocation: [],
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
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

exports.signIn = signIn;
