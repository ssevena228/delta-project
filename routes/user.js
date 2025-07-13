//require express 
const express = require("express");
// set Router
const router = express.Router({mergeParams: true});

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

const passport = require("passport");

const {saveRedurectUrl} = require("../middleware.js");

const userController = require("../controller/users.js")





//sign get route ,sign up post route
router.route("/signup")
.get(userController.renderSignupForm)
.post(
  wrapAsync(userController.signup)
);






// login get route, login post route  authintcation i done by help of passport middleware which we pass passwort.authenticate("local",{failureRedirect:"/login",failureFlash: true} )
router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedurectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  userController.login
);





router.get("/logout", userController.logout); 





module.exports = router;