const RESPONSE_MESSAGE = Object.freeze({
  SERVER_ERROR: "Invalid Server Error",
  NOT_VALID_USER: "Not Valid User",
  INVITED_USER: "Already Invited",
  ALREADY_PUBLIC_MODE: "Already in Public Mode",
  ALREADY_FRIEND: "Already in Friend List",
});

const VALIDATOR_MESSAGE = Object.freeze({
  MUST_HAVE: "필수 입력란 입니다",
  MUST_BE_EMAIL: "email 형식이어야 합니다",
  COUNT_LIMIT: "갯수 제한이 있습니다",
});

exports.RESPONSE_MESSAGE = RESPONSE_MESSAGE;
exports.VALIDATOR_MESSAGE = VALIDATOR_MESSAGE;
