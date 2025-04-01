const express = require('express');
const route = express.Router();

const userController = require('../controllers/userController');
const userAuth = require("../auth/auth");


// Route of homepage
route.get("/welcome",userAuth.isLoggedIn,userController.renderWelcomePage)

// routes for user auth
route.get("/",userAuth.isSignupLoginEnable, userController.renderSignupLoginPage);
route.post("/user/signup", userController.signup);
route.post("/user/login", userController.login);
route.get("/logout",userController.logout)

 route.get('/', userController.notFoundPage);


module.exports = route;
