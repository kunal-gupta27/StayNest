const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(req.path, "..", req.originalUrl);
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listings!!");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async(req, res, next) =>{
     const { id } = req.params;
    const listing = await Listing.findById(id);

    // 🔒 Authorization check
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!!");
        return res.redirect(`/listings/${id}`); // ✅ return added
    }
    next();
}

module.exports.validateListing =  (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) =>{
     const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    // 🔒 Authorization check
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this listing!!");
        return res.redirect(`/listings/${id}`); // ✅ return added
    }
    next();
}

