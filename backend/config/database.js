const mongoose = require("mongoose");

async function database() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("vidy-proj connected");
  } catch (err) {
    console.log(err.message);
  }
}
module.exports = database;
