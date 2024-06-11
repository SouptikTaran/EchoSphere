const { userSchema, userValidSchema, validEmailSchema, validPasswordSchema } = require("../zodSchema/userSchema");
const User = require('../models/user')
const LoginUser = require('../models/userLogin');
const Otp = require('../models/otp')
const { matchPasswordandGenerateToken } = require('../models/user')
const { createHmac, randomBytes } = require('crypto');
const { verifyEmail } = require('../services/mail')
const { validateToken } = require("../services/authentication")
const { generateOTP } = require("../services/otpGeneration")


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
  if (username == '' && email == '' && password == '') {
    return res.json({ error: "Enter required Details" });

  }
  //checking the input type of the given data
  let validation = userSchema.safeParse(data);
  if (!validation.success) {
    return res.json({ error: "Invalid Data" });
  }
  //check if user exist
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.json({ error: 'Email  Already Taken' });
    }
    await User.create({
      username,
      email,
      password
    });
  }catch{
    return res.json({error : "Email / Username Already Taken"})
  }

  try {
    const token = await User.matchPasswordandGenerateToken(email, password);
    // return res.status(200).send("successful")
    return res.cookie("token", token).json({ redirect: '/' })
  } catch (error) {
    console.log(error)
    res.json({error : error});
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

  if (email == '' && password == '') {
    return res.json({ error: "Invalid Data" });
  }
  const validation = userValidSchema.safeParse(data);
  if (!validation.success) {
    console.log(validation.error)
    return res.json({ error: "Invalid Data" });
  }
  try {
    const token = await User.matchPasswordandGenerateToken(email, password);
    console.log(token);
    return res.cookie("token", token).json({ redirect: '/' });
  } catch (error) {
    console.log(error)
    return res.json({ error: error });
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
  const validation = validEmailSchema.safeParse(email);
  if (!validation.success) return res.status(400).render('forgotEmail');
  res.cookie('email', email);

  const user = await Otp.findOne({ email });
  if (!user) {
    return res.render('verifyOtp');
  }
  const otp = generateOTP();
  await user.updateOne(
    { $set: { otp: otp } }
  );
  console.log("generated OTP : ", otp);
  verifyEmail(email, otp);
  return res.render('verifyOtp');
};
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
  const { otp } = req.body;
  const token = otp;
  console.log(req.cookies.email);
  //search user ,
  const userMail = req.cookies.email;
  const user = await Otp.findOne({ email: userMail });
  if (user == '') {
    return res.render('verifyOtp')
  }
  console.log("Forgot password : ", user);
  console.log('user.otp :', user.otp);
  console.log('code :', token);
  console.log(token, user.otp)
  if (token == user.otp) {
    return res.status(200).json({ redirect: '/user/newPassword' });
  } else {
    res.json({ error: "Wrong/Incorrect OTP" })
  }
}

module.exports.newPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  console.log('req rec')

  console.log(password, confirmPassword)
  if (password != confirmPassword || password == '' && confirmPassword == '') {
    return res.json({ error: "Password Not Matching" });
  }
  const data = {
    password, confirmPassword
  }

  const validation = validPasswordSchema.safeParse(data);
  if (!validation.success) {
    console.log(validation.error)
    return res.json('Invalid Data');
  }
  const email = req.cookies.email;
  const user = await User.findOne({ email });
  const salt = user.salt;
  const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');
  await user.updateOne({
    password: hashedPassword
  })

  console.log('successfully updates')
  return res.status(200).json({ redirect: '/' });

}

/** USER PROFILE ROUTES */
module.exports.home = (req, res) => {
  res.render('mainLogin')
}


module.exports.feed = (req, res) => {
  res.status(200).render('feed');
}

module.exports.explorer = (req, res) => {
  res.render('explorer')
}

module.exports.userHome = (req, res) => {
  res.render('frontPage');
}

/** USER PROFILE - FOLLOW - UNFOLLOW */

module.exports.userProfile = async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  // console.log(req.user)
  const { email } = req.user;
  const user = await LoginUser.findOne({ email });
  console.log(user);
  res.status(200).render('userProfile', { user, userMain: null });
}

// User Profile
module.exports.userSearch = async (req, res) => {
  const username = req.params.username;
  const currentUser = req.cookies.token;
  const ans = validateToken(currentUser);
  const button = false;
  console.log(ans);
  if (username === ans.username) {
    console.log("main user")
  } else {
    console.log("another user")
    try {
      const user = await LoginUser.findOne({ username })
        .populate('followers', 'username email profilePic')
        .populate('followings', 'username email profilePic');
      const userMain = await LoginUser.findOne({ username: ans.username });
      if (user && userMain) {
        console.log(user , userMain )
        res.status(200).render('userProfile', { user, userMain });
      }
      else {
        res.status(404).json({ msg: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}




module.exports.followUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });

        res.status(200).json({ msg: "User has been followed" });
      } else {
        res.status(403).json({ msg: "You already follow this user" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(403).json({ msg: "You can't follow yourself" });
  }
}

module.exports.unfollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });

        res.status(200).json({ msg: "User has been Unfollowed" });
      } else {
        res.status(403).json({ msg: "You Don't follow this user" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(403).json({ msg: "You can't Unfollow yourself" });
  }
}