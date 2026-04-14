const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("./"));

const DATA_FILE = "./code/assets/data.json";

// ================= GET =================
app.get("/recipes", (req, res) => {
  const data = fs.readFileSync(DATA_FILE);
  res.json(JSON.parse(data));
});

// ================= ADD =================
app.post("/recipes", (req, res) => {
  const newRecipe = req.body;

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.push(newRecipe);

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.json({ success: true });
});

// ================= UPDATE =================
app.post("/recipes/update", (req, res) => {
  const updated = req.body;

  const data = JSON.parse(fs.readFileSync(DATA_FILE));

  const index = data.findIndex((r) => r.id == updated.id);

  if (index !== -1) {
    data[index] = updated;
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.json({ success: true });
});

// 🔥 IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});