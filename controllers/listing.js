const Listing = require("../models/listing.js");
  
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
        if (!req.body.listing) {
        // return res.send("Title is required!");
        throw new ExpressError(400, "Send valid data for listing")
    }
    console.log(req.body); 
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
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
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const updatedData = req.body.listing;

    // ✅ Update
    await Listing.findByIdAndUpdate(id, updatedData, { new: true });

    req.flash("success", "Listing Updated!!");

    return res.redirect(`/listings/${id}`); // ✅ return added
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!!")
    res.redirect("/listings");
};