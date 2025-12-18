const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },       // city name exactly as saved
  country: { type: String },                    // optional
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("City", citySchema);
