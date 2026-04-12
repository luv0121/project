const User=require("../models/user.js");

module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.postroute=async(req,res,next)=>{
try{
        let {username,email,password}=req.body;
    const newuser= new User({email, username});
    const registeruser=await User.register(newuser,password);
    req.login(registeruser,(err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","Welcome to the Livaro");
        res.redirect("/listings");
    })
}catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
}

module.exports.loginrender=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postloginauthentication=async(req,res)=>{
        req.flash("success","welcome back to livaro");
        let redirecturl=res.locals.redirecturl||"/listings";
        res.redirect(redirecturl);
}
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{ 
        if(err){
        return next(err);
        }
    })
    req.flash("success","you logout");
    res.redirect("/listings");
}