const Listing = require("../models/listing.js");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });
  
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}


module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing  = async (req, res)=>{
    let {id} = req.params;
    const listing  = await Listing.findById(id)
    .populate({path: "reviews", 
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing does not exist!!");
        return res.redirect("/listings");
    }
    console.log(listing);
    
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) => {
   let response = await geocodingClient
   .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;

    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing")
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    
    req.flash("success", "New Listing Created!!");
    res.redirect("/listings");
};

module.exports.rendereditForm = async (req, res) => {
    let {id} = req.params;
    const listing  = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist!!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/ w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    let listing = await Listing.findById(id);

    // 🔥 IMPORTANT: image ko skip karo
    let updatedData = { ...req.body.listing };
    delete updatedData.image;

    Object.assign(listing, updatedData);

    // ✅ Only update image if new one is uploaded
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!!")
    res.redirect("/listings");
};