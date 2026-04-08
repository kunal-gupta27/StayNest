const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// const cookieParser  = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// //learning about the signed cookie
// app.get("/getsignedcookie",(req, res)=>{
//     res.cookie("made-in", "India", {signed: true});
//     res.send("signed cookie sent");
// })

// app.get("/verify",(req, res)=>{
//     console.log(req.signedCookies); //for signed data k liye
//     res.send("verified!!");
// })

// // learning about the cookie parsar
// app.get("/getcookies", (req, res)=>{
//     res.cookie("madein", "india");
//     res.cookie("greet", "namaste");
//     res.send("sent you some cookies");
// });


// app.get("/greet",(req, res)=>{
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi! ${name}`);
// })

// app.get("/",(req, res)=>{
//     console.log(req.cookies);  //for unsigned data k liye
//     res.send("Hi, I am root");
// })

// //routes ko segregate kiya hain humne yaha pr

// // /users
// // /users/:id
// // /users/ -> routes   
// app.use("/users", users);  // this is a common routes for users which is taken by the express

// //POSTS ROUTES
// app.use("/posts", posts);

// app.use(
//     session({
//     secret: "mysupersecretstring", 
//     resave: false, 
//     saveUninitialized: true
// }));

//or

const sessionOptions = {
    secret: "mysupersecretstring", 
    resave: false, 
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(flash());


app.use((req, res, next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register",(req, res)=>{
    let {name = "anonymous"} = req.query;
    // console.log(req.session);
    req.session.name = name;

    if(name === "anonymous"){
        req.flash("error","User not register");
    }else{
        req.flash("success","User register successfully");
    }
    res.redirect("/hello");
})

app.get("/hello", (req, res)=>{
    res.render("page.ejs", {name: req.session.name});
});


  
// app.get("/reqcount",(req, res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1; 
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// })
// app.get("/test", (req, res)=>{
//     res.send("test successful");
// });



app.listen(3000, () =>{
    console.log("server is connected to 3000");
    
})