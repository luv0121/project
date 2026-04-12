const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync=require("../utils/wrapasync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js")
const usercontroller=require("../controller/user.js");
//signup route,post route
router.route("/signup").get(usercontroller.signup).post(wrapasync(usercontroller.postroute))
//login route ,post login authentication
router.route("/login").get(usercontroller.loginrender).post(saveRedirectUrl,passport.authenticate("local",
    {failureRedirect:"/login",failureFlash:true}),
    usercontroller.postloginauthentication)
//logout route
router.get("/logout",usercontroller.logout);

module.exports=router;