const Listing=require("./models/listing.js");
const Booking = require("./models/booking.js");
const Review=require("./models/review.js");
const expressError=require("./utils/expressError.js");
const {listingschema,reviewschema}=require("./schema.js");
const { bookingschema } = require("./schema.js");

module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl
        req.flash("error","you have to logged in");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next();
}
module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("error","you are not the owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validatelisting=(req,res,next)=>{
       let {error} = listingschema.validate(req.body);
   if(error){
    let errmsg=error.details.map((el)=> el.message).join(",");
    throw new expressError(400,error);
   }else{
    next();
   }
}
module.exports.validatereview=(req,res,next)=>{
       let {error} = reviewschema.validate(req.body);
   if(error){
    let errmsg=error.details.map((el)=> el.message).join(",");
    throw new expressError(400,error);
   }else{
    next();
   }
}
module.exports.isAuthor=async (req,res,next)=>{
    let {id,reviewid}=req.params;
    let review= await Review.findById(reviewid);
    if(!review){
        req.flash("error","Review does not exist");
        return res.redirect(`/listings/${id}`);
    }

    if(!review.author || !review.author.equals(res.locals.curruser._id)){
        req.flash("error","you are not the author of review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateBooking = (req, res, next) => {
  const { error } = bookingschema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new expressError(400, msg);
  }
  next();
};

module.exports.isBookingOwner = async (req, res, next) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/listings");
    }

    if (!booking.user.equals(res.locals.curruser._id)) {
        req.flash("error", "You do not have permission for this booking");
        return res.redirect("/listings");
    }

    next();
};

module.exports.isNotListingOwnerBooking = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (listing.owner.equals(res.locals.curruser._id)) {
        req.flash("error", "You cannot book your own listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};