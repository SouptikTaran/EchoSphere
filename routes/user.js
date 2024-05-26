const router = require('express').Router();
const userController = require('../controllers/userController')
const passport = require('passport')

//Middlewares
const {tokenValidity} = require('../middlewares/jwtMiddleware')

//Login User Routes
router.get('/login', userController.login)
router.post('/login', userController.loginUser)
router.get('/Signup', userController.Signup)
router.post('/Signup', userController.SignupUser)
router.get('/logout', userController.logout)

//google auth routes
router.get('/login/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}))

router.get('/google/redirect', passport.authenticate('google', { session: false }), userController.googleRedirect)


//user profile routes
router.get('/profile' , tokenValidity , userController.userProfile)
module.exports = router