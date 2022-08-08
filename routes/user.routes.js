const router = require("express").Router();
const mongoose = require("mongoose");
const fileUploader = require("../config/cloudinary.config");
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/profile/:userId", isLoggedOut, (req, res, next) => {
  res.render("users/:userId/edit-profile");
});

router.post("/profile", isLoggedOut, (req, res, next) => {
  const { userId } = req.params;
  const { name, level, avatar } = req.body;
});
