if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");  
const ExpressError = require("./utils/ExpressError.js");
const { wrap, register } = require("module");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";

const dbUrl = process.env.ATLASDB_URL;

mongoose.connect(dbUrl)
.then(() => {
    console.log("Connected to DB");
})
.catch(err => {
    console.log("DB Error:", err);
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto : {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err)=>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false, // ⭐ isko false karo
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// app.get("/",(req, res)=>{
//     res.send("woking Fine");
// }); 



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{ 
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; 
    next();
});

// //Demo USER FOR PASSPORT

// app.get("/demouser", async (req, res)=>{
//     let fakeUser = new User({
//         email:"kunal@gmail.com",
//         username: "kunal",
//     });

//     let registerUser =  await User.register(fakeUser, "helloworld");
//     res.send(registerUser);
// })

// for listings
//here we segregated the routes in different files
app.use("/listings", listingRouter);
//for reviews
app.use("/listings/:id/reviews", reviewRouter);

app.use("/", userRouter);


app.use((req, res, next)=>{
    next(new ExpressError(404, "Page not Found!!"));
});

app.use((err, req, res, next)=>{
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});