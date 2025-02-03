const {
  registerUser,
  loginUser,
  forgotPassword,
} = require("../controller/auth/authConroller");

const router = require("express").Router();

//routes here
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgotPassword").post(forgotPassword);

module.exports = router;
