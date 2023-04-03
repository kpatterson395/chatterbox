const express = require("express");
const ejsmate = require("ejs-mate");

const path = require("path");
const mongoose = require("mongoose");
const Message = require("./models/message");
const methodOverride = require("method-override");

const app = express();

app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

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

app.get("/", async (req, res) => {
  const messages = await Message.find({});
  res.render("home", { messages });
});

app.get("/new", async (req, res) => {
  res.render("new");
});

app.get("/messages/edit/:id", async (req, res) => {
  const message = await Message.findById(req.params.id);
  res.render("edit", { message });
});

app.post("/messages", async (req, res) => {
  const message = new Message(req.body.message);
  await message.save();
  res.redirect("/");
});

app.put("/messages/:id", async (req, res) => {
  console.log(req.body.message);
  const { id } = req.params;
  const newmess = await Message.findByIdAndUpdate(id, { ...req.body.message });
  res.redirect("/");
});

app.patch("/messages/:id", async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;
  const newmess = await Message.findByIdAndUpdate(id, {
    likes: Number(likes) + 1,
  });

  res.redirect("/");
});

app.delete("/messages/:id", async (req, res) => {
  const { id } = req.params;
  const message = await Message.findByIdAndDelete(id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`serving on port ${port}`);
});
