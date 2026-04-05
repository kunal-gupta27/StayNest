const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser  = require("cookie-parser");

app.use(cookieParser("secretcode"));

//learning about the signed cookie
app.get("/getsignedcookie",(req, res)=>{
    res.cookie("made-in", "India", {signed: true});
    res.send("signed cookie sent");
})

app.get("/verify",(req, res)=>{
    console.log(req.signedCookies); //for signed data k liye
    res.send("verified!!");
})

// learning about the cookie parsar
app.get("/getcookies", (req, res)=>{
    res.cookie("madein", "india");
    res.cookie("greet", "namaste");
    res.send("sent you some cookies");
});


app.get("/greet",(req, res)=>{
    let {name = "anonymous"} = req.cookies;
    res.send(`Hi! ${name}`);
})

app.get("/",(req, res)=>{
    console.log(req.cookies);  //for unsigned data k liye
    res.send("Hi, I am root");
})

//routes ko segregate kiya hain humne yaha pr

// /users
// /users/:id
// /users/ -> routes   
app.use("/users", users);  // this is a common routes for users which is taken by the express

//POSTS ROUTES
app.use("/posts", posts);


app.listen(3000, () =>{
    console.log("server is connected to 3000");
    
})