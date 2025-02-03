const express = require("express");
const { connectDatabase } = require("./database/database");
const User = require("./model/userModel");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

//register user api
app.post("/register", async (req, res) => {
  const { email, password, phoneNumber, username } = req.body;

  if (!email || !password || !phoneNumber || !username) {
    return res.status(400).json({
      message: "Please provide email , password , phoneNumber, userName",
    });
  }

  //check if email already exists
  const userFound = await User.findOne({ userEmail: email });
  if (userFound) {
    return res.status(400).json({
      message: "email is already register",
    });
  }

  //create user
  await User.create({
    userName: username,
    userEmail: email,
    userPhoneNumber: phoneNumber,
    userPassword: bcrypt.hashSync(password, 10),
  });
  res.status(201).json({
    message: "User register successfully",
  });
});

//login api (fixed)
app.post("/login", async (req, res) => {
  const { email, password } = req.body; // ✅ Fixed req.body

  if (!email || !password) {
    return res.status(400).json({
      message: "please provide email and password",
    });
  }

  //check if that email exist or not
  const userFound = await User.findOne({ userEmail: email });

  if (!userFound) {
    //  Fix: Check if user exists
    return res.status(404).json({
      message: "user with that email not registered",
    });
  }

  //password check
  const isMatch = bcrypt.compareSync(password, userFound.userPassword);
  if (isMatch) {
    //generate token
    const token = jwt.sign({ id: userFound._id }, "process.env.SECRET_KEY", {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "Login successfully",
      token,
    });
  } else {
    return res.status(400).json({
      message: "Invalid password",
    });
  }
});

//server is running
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server is running at PORT " + PORT);
});
