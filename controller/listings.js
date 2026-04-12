const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index.ejs",{allListings});
}

module.exports.newroute=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showroute=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createroute=async(req,res)=>{
   if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = {
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
    };
   }
   let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();
   let url=req.file.path;
   let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savelisting=await newListing.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");
}

module.exports.editroute=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
          req.flash("error","Listing you requested for does not exist");
          return res.redirect("/listings");
    }
    let originalimage=listing.image.url;
    originalimage=originalimage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalimage});
}

module.exports.updateroute=async(req,res)=>{
    if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = {
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
    };
}
    let {id}=req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file !="undefined"){
   let url=req.file.path;
   let filename=req.file.filename;
   listing.image={url,filename};
   listing.save();
   }
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteroute=async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
     req.flash("success","Listing deleted");
    res.redirect("/listings");
}