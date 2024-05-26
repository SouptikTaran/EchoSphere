const { userSchema, userValidSchema } = require("../zodSchema/userSchema");
const User = require('../models/user')
const { matchPasswordandGenerateToken } = require('../models/user')


/** USER AUTHENTICATION CONTROLLERS */ 
module.exports.Signup = (req, res) => {
  res.send("signup new user page");
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
    console.log(req.body);
    // return res.status(200).send("successful")
    return res.cookie("token", token).redirect('/')
  } catch (error) {
    console.log(error)
  }
};


module.exports.login = (req, res) => {
  res.render('login')
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
    return res.status(400).send("badRequest");
  }
  try {
    const token = await User.matchPasswordandGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.log(error)
    return res.send('badRequest');
  }
}

module.exports.logout = (req, res) => {
  res.status(200).clearCookie("token").send("Successfully Logged out");
}

/**USER GOOGLE ROUTES */

module.exports.googleRedirect = (req , res)=>{
  console.log('Redirecting from Google authentication...');
  console.log('req.user:', req.user);
  console.log('req.authInfo:', req.authInfo);
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


/** USER PROFILE ROUTES */
module.exports.userProfile = (req , res)=>{
  if (!req.user) {
    return res.redirect('/login');
  }
res.status(200).send('Welcome to Profile');
}

