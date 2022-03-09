const mongoose = require("mongoose");
const config = require("../config/config");

exports.connectDB = () => {
  try {
    mongoose.connect(config.DB.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected 🧚");
  } catch (error) {
    console.log(error);
  }
};
