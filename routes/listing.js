const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");



const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}

//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//Create: New & Create Route
//GET -> /listings/new -> form ->submit->
//POST -> /listings

//New Route
router.get("/new",(req, res)=>{
    res.render("listings/new.ejs");
});


//Read : Show Route
// GET -> /listings/:id -> data dikhayega
router.get("/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing  = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

//Create route
router.post("/", 
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
    await newListing.save();
    res.redirect("/listings");
    
}));

//UPDATE: Edit & Update Route
//edit-> GET  -> /listings/:id/edit -> edit form -> submit
//PUT-> /listings/:id


//EDIT ROUTE
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing  = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// //update route

// app.put("/listings/:id", async (req, res) => {
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }) 

router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;

    let updatedData = req.body.listing;

    await Listing.findByIdAndUpdate(id, updatedData);

    res.redirect(`/listings/${id}`);
}));

//DELETE Route -> /listinigs/:id

router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
);


module.exports = router;