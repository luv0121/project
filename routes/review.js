const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const expressError=require("../utils/expressError.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {validatereview,isloggedin,isAuthor}=require("../middleware.js");
const reviewcontroller=require("../controller/review.js");
//review validates

//post route
router.post("/", validatereview,isloggedin,wrapasync(reviewcontroller.postroute));
//delete review
router.delete("/:reviewid",isloggedin,isAuthor,wrapasync(reviewcontroller.destroyroute));

module.exports=router;