const router = require('express').Router()
const { 
  signupForm, 
  signup, 
  loginForm, 
  login, 
  logout,
verifyAccount,
resetVerifyCode } = require('../controllers/authController')
const catchErrors = require('../middlewares/catchErrors')
const isLoggedOut = require('../middlewares/isLoggedOut')
const isLoggedIn = require('../middlewares/isLoggedIn')
const passport = require('../config/passport')
const User = require('../models/User')
const Resource = require('../models/Resource')
const uploadCloud = require('../config/cloudinary')

router.get('/signup', isLoggedOut('/'), signupForm)
router.post('/signup', catchErrors(signup))

router.get('/login', isLoggedOut('/'), loginForm)
router.post('/login', login)
router.get('/logout', logout)

router.get('/profile/verify/:code', isLoggedIn('/auth/login'), catchErrors(verifyAccount));
router.get('/profile/reset-code', isLoggedIn('/auth/login'), catchErrors(resetVerifyCode));


module.exports = router
