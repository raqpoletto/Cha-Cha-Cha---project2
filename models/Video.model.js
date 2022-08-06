const { Schema, model } = require("mongoose");

const videoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  description: {
    type: String,
  },
  duration: {
    type: String,
    enum: ['Short (0-1.5 mins)', 'Medium (1.5-3 mins)','Long (3-10 mins)', 'Very Long (10+ mins)']

  },
  video: {
    type: String,
    required: true
  }
});


const Video = model("Video", videoSchema);

module.exports = Video;
