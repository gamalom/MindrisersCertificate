const User = require("../../../model/userModel");
const bcrypt = require("bcryptjs");

//get my profile controller
exports.getMyProfile = async (req, res) => {
  const userId = req.user.id;
  const myProfile = await User.findById(userId);
  //send reponse
  res.status(200).json({
    data: myProfile,
  });
};

//update my profile controller
exports.updateMyProfile = async (req, res) => {
  const userId = req.user.id;
  const { userName, userEmail, userPhoneNumber } = req.body;

  //update profile
  const updateData = await User.findByIdAndUpdate(
    userId,
    {
      userName,
      userEmail,
      userPhoneNumber,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    message: "Profile Update sucessfully",
    data: updateData,
  });
};

//delete my profile
exports.deleteProfile = async (req, res) => {
  const userId = req.user.id;
  await User.findByIdAndDelete(userId);
  res.status(200).json({
    message: "Profile delete successfully",
    data: null,
  });
};

//update my password
exports.updateMyPassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({
      message: "Please enter the oldPassword newPassword,confirmNewPassword",
    });
  }
  if (newPassword !== confirmPassword) {
    res.status(400).json({
      message: "newpassowrd and oldpassowrd doesnot match",
    });
  }
  //taking out the hasing of password
  const userData = await User.findById(userId);
  const hashOldPassword = userData.userPassword;

  //check if oldpassword is not match
  const isOldPasswordCorrect = bcrypt.compareSync(oldPassword, hashOldPassword);
  if (!isOldPasswordCorrect) {
    return res.status(400).json({
      message: "Password is not correct",
    });
  }

  //password match vaye paxi
  userData.userPasword = bcrypt.hashSync(newPassword, 10);
  await userData.save();
  res.status(200).json({
    message: "password is changed successfully",
  });
};
