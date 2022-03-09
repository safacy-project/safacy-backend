const Safacy = require("../models/Safacy");

const { RESPONSE_MESSAGE } = require("../constants");

const getSafacyMsg = async (req, res) => {
  const { id } = req.params;
  try {
    const { safacyBotMsg } = await Safacy.findById(id);

    res.json(safacyBotMsg);

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

const updateSafacyMsg = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  try {
    const currentSafacy = await Safacy.findById(id).exec();
    if (!currentSafacy.safacyBotMsg.includes(message)) {
      currentSafacy.safacyBotMsg.push(message);
    }

    await currentSafacy.save();

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

const updateOriginLocation = async (req, res) => {
  const { id } = req.params;
  const { location } = req.body;
  try {
    const currentSafacy = await Safacy.findById(id).exec();
    currentSafacy.originLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    await currentSafacy.save();

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

const updateDeslocation = async (req, res) => {
  const { id } = req.params;
  const { deslocation } = req.body;

  try {
    const currentSafacy = await Safacy.findById(id).exec();
    currentSafacy.desLocation = deslocation;

    await currentSafacy.save();

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

exports.getSafacyMsg = getSafacyMsg;
exports.updateSafacyMsg = updateSafacyMsg;
exports.updateOriginLocation = updateOriginLocation;
exports.updateDeslocation = updateDeslocation;
