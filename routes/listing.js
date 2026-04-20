const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateListing, validateReview} = require("../middleware.js");

const listingController = require("../controllers/listing.js");


// same route ko ek sath likhna 
router
    .route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn, 
    validateListing,  
    wrapAsync(listingController.createListing));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner, 
    validateListing, 
    wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing)
);

// //Index Route
// router.get("/", wrapAsync(listingController.index));
//Create: New & Create Route
//GET -> /listings/new -> form ->submit->
//POST -> /listings
// //New Route
// router.get("/new", isLoggedIn, listingController.renderNewForm);
// //Read : Show Route
// // GET -> /listings/:id -> data dikhayega
// router.get("/:id", wrapAsync(listingController.showListing));

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
    if(!newListing.title){
        throw new ExpressError(400, "title is missing!!")
    }
    if(!newListing.description  ){
        throw new ExpressError(400, "description is missing!!")
    }
    if(!newListing.location){
        throw new ExpressError(400, "Location is missing!!")
    }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!!");
    res.redirect("/listings");
    
}));

//UPDATE: Edit & Update Route
//edit-> GET  -> /listings/:id/edit -> edit form -> submit
//PUT-> /listings/:id


//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.rendereditForm));

// //update route

// app.put("/listings/:id", async (req, res) => {
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }) 

// router.put("/:id", 
//     isLoggedIn,
//     isOwner, 
//     validateListing, 
//     wrapAsync(listingController.updateListing));

//DELETE Route -> /listinigs/:id

// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing)
// );


module.exports = router;
