const { userSchema, userValidSchema } = require("../zodSchema/userSchema");
const User = require('../models/user')
const { matchPasswordandGenerateToken } = require('../models/user')
const { createHmac, randomBytes } = require('crypto');
const {verifyEmail} = require('../services/mail')

/** OTP GENERATION FUNCTION */
function generateOTP() {
  let otp = '';
  const digits = '0123456789';

  for (let i = 0; i < 4; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  return otp;
}


/** USER AUTHENTICATION CONTROLLERS */
module.exports.Signup = (req, res) => {
  res.render('signupPage');
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
  res.render('loginEmail')
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
    return res.status(400).render("loginEmail");
  }
  try {
    const token = await User.matchPasswordandGenerateToken(email, password);
    console.log(token);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.log(error)
    return res.render('loginEmail');
  }
}

module.exports.logout = (req, res) => {
  const token = req.cookies.token;
  if (token === undefined) {
    res.send('login first')
  }
  res.status(200).clearCookie("token").send("Successfully Logged out");
}

module.exports.userEmailGet = (req, res) => {
  res.render('forgotEmail')
}

module.exports.userEmail = async (req, res) => {
  const { email } = req.body;
  res.cookie('email', email);
  const user = await User.findOne({ email });
  if (user == '') {
    return res.render('verifyOtp')
  }
  const otp = generateOTP();
  console.log(otp)
  await User.updateOne({
    otp: otp
  })
  verifyEmail(email , otp);
  return res.render('verifyOtp')
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

module.exports.forgotpassword = async (req, res) => {
  const { code1, code2, code3, code4 } = req.body;
  const token = code1 + code2 + code3 + code4;
  console.log(req.cookies.email);
  //search user ,
  const userMail = req.cookies.email;
  const user = await User.findOne({ email: userMail });
  if (user == '') {
    return res.render('verifyOtp')
  }
  console.log('user.otp :' , user.otp);
  console.log('code :', token);
  if(token == user.otp){
    return res.render('newPassword')
  }else{
    res.render('verifyOTP')
  }
}

module.exports.newPassword = async (req ,res)=>{
  const {password , confirmpassword} = req.body ;
  if(password != confirmpassword){
    return res.render('newPassword');
  }
  const email = req.cookies.email ;
  const user = await User.findOne({email});
  const salt = user.salt;
  const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');
  await user.updateOne({
    password : hashedPassword
  })

  console.log('successfully updates')
  res.redirect('/')

}

/** USER PROFILE ROUTES */
module.exports.home = (req, res) => {
  res.render('mainLogin')
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