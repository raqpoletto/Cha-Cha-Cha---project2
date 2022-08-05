const { Schema, model } = require("mongoose");

const videoSchema = new Schema({
  title: String,
  level: {},
});
