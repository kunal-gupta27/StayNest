const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");  
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { wrap } = require("module");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


const listings = require("./routes/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";

main().then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/",(req, res)=>{
    res.send("woking Fine");
}); 

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}


app.use("/listings", listings);


// app.get("/testListing",async (req, res) => {
//     let samplListing = new Listing({
//         title: "My New Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await samplListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//Create: New & Create Route
//GET -> /listings/new -> form ->submit->
//POST -> /listings

//New Route
app.get("/listings/new",(req, res)=>{
    res.render("listings/new.ejs");
});


//Read : Show Route
// GET -> /listings/:id -> data dikhayega
app.get("/listings/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing  = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

app.post("/listings", 
    validateListing,  
    wrapAsync(async (req, res, next) => {

        if (!req.body.listing) {
            throw new ExpressError(400, "Send valid data for listing");
        }

        console.log(req.body); 
        
        const newListing = new Listing(req.body.listing);

        // ✅ default image logic
        if (!newListing.image || !newListing.image.url || newListing.image.url.trim() === "") {
            newListing.image = {
                url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                filename: "defaultimage"
            };
        }

        await newListing.save();

        // ✅ IMPORTANT (ye missing tha)
        res.redirect("/listings");
    
}));

//UPDATE: Edit & Update Route
//edit-> GET  -> /listings/:id/edit -> edit form -> submit
//PUT-> /listings/:id


//EDIT ROUTE
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
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

app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;

    let updatedData = req.body.listing;

    await Listing.findByIdAndUpdate(id, updatedData);

    res.redirect(`/listings/${id}`);
}));

//DELETE Route -> /listinigs/:id

app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

//Reviews Routing working here
//Post Review Routes
app.post("/listings/:id/reviews", 
    validateReview, 
    wrapAsync(async(req, res) => {
    let id = req.params.id.trim();
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");
    
    res.redirect(`/listings/${listing._id}`);
}));


//Delete review route

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

app.use((req, res, next)=>{
    next(new ExpressError(404, "Page not Found!!"));
});

app.use((err, req, res, next)=>{
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
