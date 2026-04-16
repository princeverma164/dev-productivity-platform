const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: String,
  message: String,
  rating: Number,
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);