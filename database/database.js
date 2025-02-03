const moongose = require("mongoose");

exports.connectDatabase = async (URI) => {
  await moongose.connect(URI);
  console.log("Database connect successfully");
};
