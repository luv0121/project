const Listing=require("../models/listing.js");
const Review=require("../models/review.js");


module.exports.postroute=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
     req.flash("success","New review created");
    res.redirect(`/listings/${listing._id}`);

}

module.exports.destroyroute=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
     req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}