const jwt = require('jsonwebtoken')
const passport = require('passport')
const Resource = require('../models/Resource')
const transport = require('./../config/sendMail')
const User = require('../models/User')

exports.signupForm = (req, res) => {
  res.render('auth/signup')
}

exports.signup = async (req, res) => {
  const { email, password, name, lastname } = req.body;
  const confirmationCode = jwt.sign({ email }, process.env.SECRET);

  const { _id } = await User.register({ email, name, lastname, confirmationCode }, password);

  const text = `
    You are reciving this message because this email was used to sign up on
    a very simple webapp.

    To verify this email direcction please go to this link:

    <a href="http://localhost:${process.env.PORT}/auth/profile/verify/${confirmationCode}">
    "href="http://localhost:${process.env.PORT}/auth/profile/verify/${confirmationCode}"
    </a>
  `;

  await transport.sendMail({
    from: `"IronBuddy" <${process.env.EMAIL}>`,
    to: email,
    subject: 'Welcome to IronBuddy plattform!',
    text,
    html: `<h1>Just clic to verify your account</h1>
      <p>${text}</p>
    `
  });
  res.redirect('/auth/login');
}

exports.verifyAccount = async (req, res) => {
  const { code } = req.params;
  const user = await User.findById(req.user.id);
 
  if (code === user.confirmationCode) {
    user.confirmationCode = undefined;
    await user.save();
    console.log('entering');
  } else if (user.confirmationCode) {
    res.send(`
      Wrong code :/

      <a href="/profile">Go back</a>
    `);
  }

  res.redirect('/profile');
}


exports.resetVerifyCode = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.confirmationCode) {
    user.confirmationCode = jwt.sign({ email: user.email }, process.env.SECRET);
    const text = `
    You are reciving this message because this email was used to sign up on
    IronBuddy Platform

    To verify this email direcction please go to this link:

    <a href="http://localhost:${process.env.PORT}/auth/profile/verify/${user.confirmationCode}">
    Confirmation link
    </a>
  `;

    await transport.sendMail({
      from: `"Admin" <${process.env.EMAIL}>`,
      to: user.email,
      subject: 'Verification code',
      text,
      html: `<h1>Very simple webapp verification email</h1>
      <p>${text}</p>
    `
    });
    await user.save();
  }
  res.redirect('/profile');
};

exports.loginForm = (req, res) => {
  res.render('auth/login', { action: 'Login' })
}

exports.login = (req, res, next)=>{
  passport.authenticate('local', (err, user)=>{
    req.app.locals.user = user

    req.logIn(user, err =>{
      return res.redirect('/')
    } )
  })(req, res, next)
}

exports.logout = (req, res) => {
  req.logout()
  delete req.app.locals.user
  res.redirect('/auth/login')
}

exports.getDashboard = async (req, res) => {
  const user = await User.findById(req.user._id).populate('resource')
  user.status = user.confirmationCode ? 'Not verified' : 'Verified'
  res.render('index', user)
}


