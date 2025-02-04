const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: [true, "userEmail must be provided"],
    },
    userPhoneNumber: {
      type: String,
      required: [true, "PhoneNumber must be provided"],
    },
    userPassword: {
      type: String,
      required: [true, "password must be provided"],
    },
    userName: {
      type: String,
      required: [true, "userName must be provided"],
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    otp: {
      type: Number,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
