const moongose = require("mongoose");
const User = require("../model/userModel");
const adminSeeder = require("../adminSeeder");

exports.connectDatabase = async (URI) => {
  await moongose.connect(URI);
  console.log("Database connect successfully");

  //admin seeding
  adminSeeder();
};
