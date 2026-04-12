const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");
const Listing=require("../models/listing.js");
const {isloggedin,isOwner,validatelisting}=require("../middleware.js");
const listingcontroller=require("../controller/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage})


//index route ,create route
router.route("/").get(wrapasync(listingcontroller.index)).post(isloggedin,upload.single("listing[image][url]"),validatelisting,wrapasync(listingcontroller.createroute));
//new route
router.get("/new",isloggedin,listingcontroller.newroute);
//show route ,put route ,delete route
router.route("/:id").get(wrapasync(listingcontroller.showroute)).put(isloggedin,isOwner,upload.single("listing[image][url]"),validatelisting,wrapasync(listingcontroller.updateroute)).delete(isloggedin,isOwner,wrapasync(listingcontroller.deleteroute))
//edit route
router.get("/:id/edit",isloggedin,isOwner,wrapasync(listingcontroller.editroute));

module.exports = router;