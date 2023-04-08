const express = require("express");
const ejsmate = require("ejs-mate");

const path = require("path");
const mongoose = require("mongoose");
const Message = require("./models/message");
const methodOverride = require("method-override");
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/chatbox";
const secret = process.env.secret || "thisisasecret";

const sessionConfig = {
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//methods added in from mongoose local passport plugin
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose
  .connect("mongodb://localhost:27017/chatbox")
  .then(() => {
    console.log("MONGO CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("mongo connection error!", err);
  });

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};

app.get("/", async (req, res) => {
  const messages = await Message.find({}).populate({
    path: "author",
  });
  res.render("home", { messages });
});

app.get("/messages/new", isLoggedIn, (req, res) => {
  res.render("new");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    req.flash("success", `Welcome to chatterbox, ${req.user.username}`);
    res.redirect("/");
  }
);

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body.user;
    const user = new User({ username, email });
    const newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome to chatterbox, ${newUser}`);
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return console.log(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
});

app.get("/messages/edit/:id", isLoggedIn, async (req, res) => {
  const message = await Message.findById(req.params.id);
  res.render("edit", { message });
});

app.post("/messages", isLoggedIn, async (req, res) => {
  const message = new Message({ ...req.body.message, likes: [] });
  message.author = req.user._id;
  await message.save();
  res.redirect("/");
});

app.put("/messages/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const newmess = await Message.findByIdAndUpdate(id, { ...req.body.message });
  res.redirect("/");
});

app.patch("/messages/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const newmess = await Message.findById(id);
  if (newmess.likes.includes(req.user._id)) {
    newmess.likes = newmess.likes.filter((x) => x === req.user._id);
  } else {
    newmess.likes.push(req.user._id);
  }
  await newmess.save();

  res.redirect("/");
});

app.delete("/messages/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const message = await Message.findByIdAndDelete(id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`serving on port ${port}`);
});
