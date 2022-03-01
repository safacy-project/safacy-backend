const Safacy = require("../models/Safacy");
const User = require("../models/User");

const getUserInfo = async (req, res, next) => {
  const { id } = req.params;
  try {
    const userSafacy = await User.findById(id)
      .populate("myFriendList")
      .populate("safacyHistory")
      .lean()
      .exec();

    res.json(userSafacy);
  } catch (err) {
    res.json({
      error: {
        message: "Invalid Server Error",
        code: 500,
      },
    });
  }
};

const startPublicMode = async (req, res, next) => {
  const { id } = req.params;

  try {
    await User.updateOne({ id }, { $set: { publicMode: true } });
    const { publicMode } = await User.findById(id).lean().exec();

    res.json({
      publicMode,
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

const createSafacy = async (req, res, next) => {
  const { id } = req.params;
  const { destination, radius, time, invitedFriendList } = req.body;

  try {
    const currentUser = await User.findById(id).exec();
    const currentUserId = currentUser._id;

    const newSafacy = await Safacy.create({
      user: currentUser.email,
      destination,
      radius,
      time,
      invitedFriendList,
    });

    const newSafacyId = newSafacy._id;
    await currentUser.safacyHistory.push(newSafacyId);

    const updateFriendInvitation = async (friendEmail, userId) => {
      const friend = await User.findOne({ email: friendEmail }).exec();
      friend.safacyInvitationList.push(userId);
      await friend.save();
    };

    for (let i = 0; i < invitedFriendList.length; i++) {
      updateFriendInvitation(invitedFriendList[i], currentUserId);
    }

    await currentUser.save();

    res.json(newSafacy);
  } catch (err) {
    res.json({
      error: {
        message: "Invalid Server Error",
        code: 500,
      },
    });
  }
};

const getCurrentSafacy = async (req, res, next) => {
  try {
    console.log("something");
  } catch (err) {
    console.log(err);
  }
};

const stopPublicMode = async (req, res, next) => {
  const { id } = req.params;

  try {
    await User.updateOne({ id }, { $set: { publicMode: false } });
    const { publicMode } = await User.findById(id).lean().exec();

    res.json({
      publicMode,
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

exports.getUserInfo = getUserInfo;
exports.startPublicMode = startPublicMode;
exports.createSafacy = createSafacy;
exports.getCurrentSafacy = getCurrentSafacy;
exports.stopPublicMode = stopPublicMode;
