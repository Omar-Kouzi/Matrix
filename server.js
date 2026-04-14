const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static("./"));

const DATA_FILE = "./code/assets/data.json";

// ✅ SAFE READ FUNCTION
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Read error:", err);
    return [];
  }
}

// ✅ SAFE WRITE FUNCTION
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Write error:", err);
  }
}

// ================= GET =================
app.get("/recipes", (req, res) => {
  res.json(readData());
});

// ================= ADD =================
app.post("/recipes", (req, res) => {
  try {
    const newRecipe = req.body;

    const data = readData();
    data.push(newRecipe);

    writeData(data);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add recipe" });
  }
});

// ================= UPDATE =================
app.post("/recipes/update", (req, res) => {
  try {
    const updated = req.body;

    const data = readData();
    const index = data.findIndex((r) => r.id == updated.id);

    if (index !== -1) {
      data[index] = updated;
      writeData(data);
      return res.json({ success: true });
    }

    res.status(404).json({ error: "Recipe not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

// ================= PORT =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});