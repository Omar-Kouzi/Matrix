const express = require("express");
const fs = require("fs");
const app = express();
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname);

app.use(connectLiveReload());
app.use(express.json());
app.use(express.static("./"));

const DATA_FILE = "./code/assets/data.json";

app.get("/recipes", (req, res) => {
  const data = fs.readFileSync(DATA_FILE);
  res.json(JSON.parse(data));
});

app.post("/recipes", (req, res) => {
  const newRecipe = req.body;

  const data = JSON.parse(fs.readFileSync(DATA_FILE));

  data.push(newRecipe);

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
liveReloadServer.refresh("/");
  res.json({ success: true });
});
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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
