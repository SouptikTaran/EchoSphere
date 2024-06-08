require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const PATH = require("path");
const cookieParser = require('cookie-parser');



//passport setup
const passport = require('passport')
const passportSetup = require('./services/passport-setup')

//cookie middlesware
app.use(cookieParser());


//Middleware for form data
app.use(express.urlencoded({ extended: true }));

//Database
const DB = require("./configs/DB")

app.use(passport.initialize())

//setting up the app engine
app.set("view engine", "ejs");
app.set('views', [
  PATH.resolve('./views/user'),
  PATH.resolve('./views')
]);
// static files
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/uploads'));

//Middleware to pass json data
app.use(express.json());

//Importing the Routes
const routes = require("./routes/indexRoutes");
app.use('/', routes);


//Global Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json("Internal error");
});

app.listen(PORT, () => {
  console.log(`SERVER STARTED : http://localhost:${PORT}`.bgWhite.black);
});
