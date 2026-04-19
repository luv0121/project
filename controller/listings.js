const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const { search, category } = req.query;
    let query = {};

    if (search && search.trim() !== "") {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    if (category && category.trim() !== "") {
        query.category = category;
    }

    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { 
        allListings,
        search: search || "",
        selectedCategory: category || ""
    });
};

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

module.exports.createroute = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    } else {
        newListing.image = {
            url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            filename: "default-listing-image"
        };
    }

    if (response.body.features.length > 0) {
        newListing.geometry = response.body.features[0].geometry;
    }

    await newListing.save();
    req.flash("success", "New Listing created");
    res.redirect("/listings");
};

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

module.exports.updateroute = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteroute=async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
     req.flash("success","Listing deleted");
    res.redirect("/listings");
}