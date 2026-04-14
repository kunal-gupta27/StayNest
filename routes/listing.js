const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateListing, validateReview} = require("../middleware.js");



//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//Create: New & Create Route
//GET -> /listings/new -> form ->submit->
//POST -> /listings

//New Route
router.get("/new", isLoggedIn, (req, res)=>{
    res.render("listings/new.ejs");
});


//Read : Show Route
// GET -> /listings/:id -> data dikhayega
router.get("/:id", wrapAsync(async (req, res)=>{
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
}));

//Create route
router.post("/",
    isLoggedIn, 
    validateListing,  
    wrapAsync(async (req, res, next) => {
        if (!req.body.listing) {
        // return res.send("Title is required!");
        throw new ExpressError(400, "Send valid data for listing")
    }
    console.log(req.body); 
    
    const newListing = new Listing(req.body.listing);
    // if(!newListing.title){
    //     throw new ExpressError(400, "title is missing!!")
    // }
    // if(!newListing.description  ){
    //     throw new ExpressError(400, "description is missing!!")
    // }
    // if(!newListing.location){
    //     throw new ExpressError(400, "Location is missing!!")
    // }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!!");
    res.redirect("/listings");
    
}));

//UPDATE: Edit & Update Route
//edit-> GET  -> /listings/:id/edit -> edit form -> submit
//PUT-> /listings/:id


//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing  = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist!!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

// //update route

// app.put("/listings/:id", async (req, res) => {
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }) 

router.put("/:id", 
    isLoggedIn,
    isOwner, 
    validateListing, 
    wrapAsync(async (req, res) => {
    const { id } = req.params;

    const updatedData = req.body.listing;

    // ✅ Update
    await Listing.findByIdAndUpdate(id, updatedData, { new: true });

    req.flash("success", "Listing Updated!!");

    return res.redirect(`/listings/${id}`); // ✅ return added
}));

//DELETE Route -> /listinigs/:id

router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!!")
    res.redirect("/listings");
})
);


module.exports = router;