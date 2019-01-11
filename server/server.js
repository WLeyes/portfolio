const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

// Mongoose
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
require("dotenv").config();
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true }
);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const { auth } = require("./middleware/auth");
const { admin } = require("./middleware/admin");

// Models
const { User } = require("./models/user");
const { Project } = require("./models/project");

// Routes
// todo: move to routes file

/**
 * @route  POST api/users/auth
 * @desc   Check if user is authorized
 * @access Public
 */
app.post("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    role: req.user.role
  });
});

/**
 * @route  POST api/users/register
 * @desc   User registration
 * @access Public
 */
app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true
    });
  });
});

/**
 * @route  POST api/users/login
 * @desc   User login
 * @access Public
 */
app.post("/api/users/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Authorization failed, email not found"
      });
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Invalid password" });
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({
            loginSuccess: true
          });
      });
    });
  });
});

/**
 * @route  GET api/user/logout
 * @desc   Logout current user
 * @access Private
 */
app.get("/api/user/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    });
  });
});

/**
 * @route  POST api/project/create
 * @desc   Create project for profile
 * @access Private
 */
app.post("/api/project/create", auth, admin, (req, res) => {
  const project = new Project(req.body);
  project.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      project: doc
    });
  });
});

/**
 * @route  get api/projects
 * @desc   get all projects
 * @access Public
 */
app.get("/api/projects", (req, res) => {
  Project.find({}, (err, projects) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(projects);
  });
});

/**
 * @route  get api/project/:id
 * @desc   get project by id
 * @access Public
 */
app.get("/api/project/:id", (req, res) => {
  Project.findById(req.params.id, (err, project) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(project);
  });
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
