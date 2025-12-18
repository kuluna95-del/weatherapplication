const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allow requests only from frontend port
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Connect to MongoDB (Weather App DB)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for Weather App"))
  .catch((err) => console.error("MongoDB connect error:", err));

// City model
const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String },
});

const City = mongoose.model("City", citySchema);

// Routes
app.get("/api/cities", async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/cities", async (req, res) => {
  try {
    const { name, country } = req.body;
    const city = new City({ name, country });
    await city.save();
    res.json(city);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "City already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/cities/:id", async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Weather App server running on port ${PORT}`)
);
