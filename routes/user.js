const router = require('express').Router();
const userController = require('../controllers/userController')
const passport = require('passport')


//Middlewares
const { tokenValidity  , tokenExist} = require('../middlewares/jwtMiddleware')

//Login User Routes
router.get('/' , tokenExist,userController.home)
router.get('/login', tokenExist,userController.login)
router.post('/login', userController.loginUser)
router.get('/Signup', tokenExist ,userController.Signup)
router.post('/Signup', userController.SignupUser)
router.get('/logout', userController.logout)
router.post('/forgotPassword' ,userController.forgotpassword)
router.get('/forgotemail' , tokenExist ,userController.userEmailGet )
router.post('/forgotemail' ,  userController.userEmail)
router.post('/newpassword' ,  userController.newPassword)

//google auth routes
router.get('/login/google', passport.authenticate('google', {scope: ['email', 'profile']}))
router.get('/google/redirect', passport.authenticate('google', { session: false }), userController.googleRedirect)


//user profile routes
router.get('/profile', tokenValidity, userController.userProfile)
router.get('/feed', tokenValidity , userController.feed);
router.get('/explorer' , tokenValidity ,userController.explorer);
router.get('/home' , tokenValidity ,userController.userHome);
router.get('/chatting'  ,(req , res)=>{
    res.render('chats')
});


// User follow and unfollow
router.get('/:id', userController.userId);
router.put('/:id/follow',userController.followUser);
router.put('/:id/unfollow', userController.unfollowUser);


module.exports = router