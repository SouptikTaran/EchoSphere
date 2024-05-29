const { userSchema, userValidSchema } = require("../zodSchema/userSchema");
const User = require('../models/user')
const { matchPasswordandGenerateToken } = require('../models/user')


/** USER AUTHENTICATION CONTROLLERS */
module.exports.Signup = (req, res) => {
  res.render('signup_page');
};

module.exports.SignupUser = async (req, res) => {
  //Created an object for checking if the data is valid or not
  const { username, email, password } = req.body;
  const data = {
    username,
    email,
    password,
  };
  //checking the input type of the given data
  let validation = userSchema.safeParse(data);
  if (!validation.success) {
    return res.status(400).send("validation error");
  }
  //check if user exist
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(409).send('User existing');
  }
  await User.create({
    username,
    email,
    password
  });
  try {
    const token = await User.matchPasswordandGenerateToken(email, password);
    // return res.status(200).send("successful")
    return res.cookie("token", token).redirect('/')
  } catch (error) {
    console.log(error)
  }
};


module.exports.login = (req, res) => {
  res.render('login_email')
}



module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const data = {
    email,
    password
  }
  const validation = userValidSchema.safeParse(data);
  if (!validation.success) {
    console.log(validation.error)
    return res.status(400).render("login_email");
  }
  try {
    const token = await User.matchPasswordandGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.log(error)
    return res.render('login_email');
  }
}

module.exports.logout = (req, res) => {
  const token = req.cookies.token ;
  if(token === undefined){
    res.send('login first')
  }
  res.status(200).clearCookie("token").send("Successfully Logged out");
}

/**USER GOOGLE ROUTES */

module.exports.googleRedirect = (req, res) => {
  if (req.user && req.authInfo.token) {
    // Send the JWT to the client
    res.cookie('token', req.authInfo.token, { httpOnly: true, secure: true });
    // console.log('token after set : ' , res.cookie);
    // console.log('Token set:', req.authInfo.token);
    res.redirect('/'); // Redirect to the home page
  } else {
    console.log('Authentication failed');
    res.status(401).send('Authentication failed');
  }
}

module.exports.forgotpassword = (req, res) => {
  res.status(200).render('verify_otp')
}


/** USER PROFILE ROUTES */
module.exports.home = (req, res) => {
  res.render('mainlogin')
}

module.exports.userProfile = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.status(200).send('Welcome to Profile');
}

module.exports.feed = (req, res) => {
  res.status(200).render('feed');
}