const express = require("express");
const router = express.Router();
const City = require("../models/City");

// GET saved cities
router.get("/", async (req, res) => {
  try {
    const cities = await City.find().sort({ createdAt: -1 });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST save city
router.post("/", async (req, res) => {
  try {
    const { name, country } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    const exists = await City.findOne({ name }); // optional dedupe
    if (exists) return res.status(200).json(exists); // return existing
    const city = new City({ name, country });
    await city.save();
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a city
router.delete("/:id", async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    const cities = await City.find().sort({ createdAt: -1 });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
