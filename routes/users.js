var express = require("express");
var router = express.Router();
var userController = require("../controllers/userController");
var auth = require("../controllers/authController");
var passport = require("passport");
// var pool =require("../config/postgrePool");
var Recaptcha = require('express-recaptcha').RecaptchaV3;

// router.post("/login", (req,res)=>{res.json({success:true})});
router.post("/login", passport.authenticate("local"), auth.auth);
router.get("/authenticate", auth.authenticate);
router.post("/signup", userController.signup);
router.get("/activate/:token", userController.activateUser);
// router.get("/send_otp", userController.sendOTP);
// router.get("/confirm_otp", userController.confirmOTP);
router.get("/reset_password/:token", userController.resetPass);
router.post("/update_password", userController.updatePass);
router.post("/update_info", userController.updateInfo);
// router.post("/update_pass", userController.updateInfo);
router.get("/forget_password", userController.sendPassResetToken);
router.get("/logout", userController.logout);

router.get("/cap",)

module.exports = router;

