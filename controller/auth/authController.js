const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../model/userModel");
const sendEmail = require("../../services/sendEmail");

//registeruser
exports.registerUser = async (req, res) => {
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
};

//login users
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
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
    const token = jwt.sign({ id: userFound._id }, process.env.SECRET_KEY, {
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
};

//forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Pls provide email",
    });
  }
  // CHECK IF EMAIL EXISTS
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(404).json({
      message: "Email is not registered ",
    });
  }
  // SEND OTP TO THAT EMAIL
  const otp = Math.floor(1000 + Math.random() * 9000);
  userExist.otp = otp;
  await userExist.save();
  await sendEmail({
    email: email,
    subject: "Your otp for mindrisersCertificate forgotPassword",
    message: `${otp}`,
  });
  res.status(200).json({
    message: "otp is send successfully",
  });
};

//verify otp
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "Pls provide email and OTP",
    });
  }

  // Check if the email exists
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "Email not registered",
    });
  }

  // Check if OTP matches
  if (userExist.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }
  //otp of databse is set undefine
  userExist.otp = undefined;
  userExist.isOtpVerified = true;
  await userExist.save();
  res.status(200).json({
    message: "OTP matched successfully",
  });
};

//reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide email, newPassword, and confirmPassword",
    });
  }

  // Check if newPassword and confirmPassword match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "newPassword and confirmPassword do not match",
    });
  }

  // Check if the email exists
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(404).json({
      message: "Email is not registered",
    });
  }

  if (userExist.isOtpVerified !== true) {
    return res.status(400).json({
      message: "You cannot perform this action",
    });
  }
  // Hash the new password and update in the database
  userExist.userPassword = bcrypt.hashSync(newPassword, 10);
  userExist.isOtpVerified = false;
  await userExist.save();

  res.status(200).json({
    message: "Password changed successfully",
  });
};
