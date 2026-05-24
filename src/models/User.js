/** @format */

// models/User.js
const mongoose = require("mongoose");
const config = require("config");

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  created: { type: Number, required: true },
  lastupdated: { type: Number, defualt: 0 },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Number, default: 0 },
  activated: { type: Boolean, required: false, default: false },
  usertype: { type: String, default: "" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
