const { body, validationResult } = require("express-validator");
const { VALIDATOR_MESSAGE } = require("../constants");

const addNewFriendInputValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(VALIDATOR_MESSAGE.MUST_HAVE)
    .isEmail()
    .withMessage(VALIDATOR_MESSAGE.MUST_BE_EMAIL),
];

const createSafacyInputValidators = [
  body("destination").exists().withMessage(VALIDATOR_MESSAGE.MUST_HAVE),
  body("radius").exists().withMessage(VALIDATOR_MESSAGE.MUST_HAVE),
  body("time").exists().withMessage(VALIDATOR_MESSAGE.MUST_HAVE),
  body("invitedFriendList")
    .exists()
    .withMessage(VALIDATOR_MESSAGE.MUST_HAVE)
    .isArray({ min: 1 })
    .withMessage(VALIDATOR_MESSAGE.COUNT_LIMIT),
];

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    const errorObj = {};

    if (!errors.isEmpty()) {
      errors.array().forEach((error) => {
        const { param: key, msg: message } = error;
        const inputName = key.split(".")[1];

        if (errorObj[inputName]) {
          return;
        }

        errorObj[inputName] = message;
      });

      errorObj.code = 400;
      res.json({ error: errorObj });
      return;
    }

    next();
  };
};

exports.validate = validate;
exports.createSafacyInputValidators = createSafacyInputValidators;
exports.addNewFriendInputValidators = addNewFriendInputValidators;
