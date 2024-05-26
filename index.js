require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT | 8000;
const path = require("path");
const cookieParser = require('cookie-parser');



//passport setup
const passport = require('passport')
const passportSetup = require('./services/passport-setup')

//cookie middlesware
app.use(cookieParser());

//Database
const DB = require("./configs/DB")

app.use(passport.initialize())

//setting user static pages
app.set("views", path.join(__dirname, "views", "user"));

//setting up the app engine
app.set("view engine", "ejs");

//Middleware to pass json data
app.use(express.json());

//Importing the controllers
const userRoutes = require("./routes/user");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`SERVER STARTED : http://localhost:${PORT}`.bgWhite.black);
});
