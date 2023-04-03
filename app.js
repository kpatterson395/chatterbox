const express = require("express");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/chatbox";
const secret = process.env.secret || "thisisasecret";

mongoose
  .connect("mongodb://localhost:27017/chatbox")
  .then(() => {
    console.log("MONGO CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("mongo connection error!", err);
  });

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(port, () => {
  console.log(`serving on port ${port}`);
});
