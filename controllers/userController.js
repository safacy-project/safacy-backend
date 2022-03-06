const Safacy = require("../models/Safacy");
const User = require("../models/User");

const { RESPONSE_MESSAGE } = require("../constants");

const getUserInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const userSafacy = await User.findById(id)
      .populate("myFriendList")
      .populate("safacyHistory")
      .populate("safacyInvitationList")
      .lean()
      .exec();

    res.json(userSafacy);

    return;
  } catch (err) {
    res.json({
      error: {
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

const startPublicMode = async (req, res) => {
  const { id } = req.params;

  try {
    await User.updateOne({ id }, { $set: { publicMode: true } });
    const { publicMode } = await User.findById(id).lean().exec();

    res.json({
      publicMode,
    });

    return;
  } catch (err) {
    res.json({
      error: {
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

const createSafacy = async (req, res) => {
  const { id } = req.params;
  const { destination, radius, time, invitedFriendList } = req.body;

  try {
    const currentUser = await User.findById(id).exec();
    const currentUserId = currentUser._id;

    if (currentUser.privateMode) {
      res.json({
        error: {
          message: RESPONSE_MESSAGE.ALREADY_PUBLIC_MODE,
          code: 404,
        },
      });

      return;
    }

    const newSafacy = await Safacy.create({
      user: currentUser.email,
      destination,
      radius,
      time,
      invitedFriendList,
    });

    const newSafacyId = newSafacy._id;
    currentUser.safacyHistory.push(newSafacyId);

    const updateFriendInvitation = async (friendEmail, userId) => {
      const friend = await User.findOne({ email: friendEmail }).exec();
      friend.safacyInvitationList.push(userId);
      await friend.save();
    };

    for (let i = 0; i < invitedFriendList.length; i++) {
      updateFriendInvitation(invitedFriendList[i], currentUserId);
    }

    Promise.all([
      await User.updateOne(
        { _id: currentUserId },
        { $set: { publicMode: true } }
      ),
      currentUser.save(),
    ]);

    res.json(newSafacy);

    return;
  } catch (err) {
    res.json({
      error: {
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

const getCurrentSafacy = async (req, res) => {
  const { id } = req.params;
  try {
    const { safacyHistory } = await User.findById(id).lean().exec();
    const currentSafacyId = safacyHistory.pop();
    const currentSafacy = await Safacy.findById(currentSafacyId).lean().exec();

    res.json(currentSafacy);
    return;
  } catch (err) {
    res.json({
      error: {
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

const stopPublicMode = async (req, res) => {
  const { id } = req.params;
  const { safacyId } = req.body;

  try {
    const currentUser = await User.findById(id).exec();
    const currentUserId = currentUser._id;
    await User.updateOne(
      { _id: currentUserId },
      { $set: { publicMode: false } }
    );
    const { publicMode } = await User.findById(id).lean().exec();
    const { invitedFriendList } = await Safacy.findById(safacyId).lean().exec();

    const deleteEmail = async (friendEmail) => {
      const invitedFriend = await User.findOne({
        email: friendEmail,
      }).exec();

      const newSafacyInvitationList = invitedFriend.safacyInvitationList.filter(
        (invitation) => invitation.toString() !== currentUserId.toString()
      );
      invitedFriend.safacyInvitationList = newSafacyInvitationList;
      await invitedFriend.save();
    };

    for (let i = 0; i < invitedFriendList.length; i++) {
      deleteEmail(invitedFriendList[i]);
    }

    res.json({
      publicMode,
    });

    return;
  } catch (err) {
    res.json({
      error: {
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

const addNewFriend = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const { email: userEmail } = await User.findById(id).lean().exec();
    const friend = await User.findOne({ email }).exec();

    if (!friend) {
      res.json({
        message: RESPONSE_MESSAGE.NOT_VALID_USER,
        code: 404,
      });
      return;
    }

    if (friend.friendInvitationList.includes(userEmail)) {
      res.json({
        message: RESPONSE_MESSAGE.INVITED_USER,
        code: 404,
      });
      return;
    }

    for (let i = 0; i < friend.myFriendList.length; i++) {
      if (friend.myFriendList[i].toString === id) {
        res.json({
          message: RESPONSE_MESSAGE.ALREADY_FRIEND,
          code: 404,
        });
        return;
      }
    }

    friend.friendInvitationList.push(userEmail);
    await friend.save();

    res.json({
      result: "ok",
    });
    return;
  } catch (err) {
    res.json({
      error: {
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

const acceptFriendInvitation = async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const currentUser = await User.findById(id).exec();
    const inviteUser = await User.findOne({ email }).exec();

    const newFriendList = currentUser.friendInvitationList.filter(
      (friendEmail) => friendEmail !== email
    );
    currentUser.friendInvitationList = newFriendList;
    currentUser.myFriendList.push(inviteUser._id);
    inviteUser.myFriendList.push(currentUser._id);

    Promise.all([currentUser.save(), inviteUser.save()]);
    res.json({
      result: "ok",
    });
    return;
  } catch (err) {
    res.json({
      error: {
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

exports.getUserInfo = getUserInfo;
exports.createSafacy = createSafacy;

exports.startPublicMode = startPublicMode;
exports.stopPublicMode = stopPublicMode;

exports.getCurrentSafacy = getCurrentSafacy;

exports.addNewFriend = addNewFriend;
exports.acceptFriendInvitation = acceptFriendInvitation;
