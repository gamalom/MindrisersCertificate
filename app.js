const express = require("express");
const { connectDatabase } = require("./database/database");
const app = express();

//ROUTES HERE
const authRoute = require("./routes/authRoute");

//ROUTES END
const {
  registerUser,
  login,
  loginUser,
} = require("./controller/auth/authConroller");
//tell node to use dotenv
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect database
connectDatabase(process.env.MONGO_URL);

//test api to check if serer is live or not
app.get("/", (req, res) => {
  res.status(200).json({
    message: "hello world",
  });
});

app.use("", authRoute);
app.use("", loginUser);

//server is running
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server is running at PORT " + PORT);
});
