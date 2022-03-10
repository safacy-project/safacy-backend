const User = require("../models/User");
const Safacy = require("../models/Safacy");

const { RESPONSE_MESSAGE } = require("../constants");

const signIn = async (req, res) => {
  const { email, nickname } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      const newUser = await User({
        email,
        nickname,
      });

      const userSafacy = await Safacy({
        user: email,
        publicMode: false,
        destination: "현재위치",
        radius: 50,
        time: 30,
        invitedFriendList: [],
        safacyBotMsg: [],
        originLocation: [
          {
            latitude: 37.518227,
            longitude: 127.0434187,
          },
        ],
        userDestination: [],
        desLocation: [],
      });

      newUser.safacyHistory.push(userSafacy._id);
      Promise.all([newUser.save(), userSafacy.save()]);
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
