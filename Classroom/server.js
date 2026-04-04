const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");


app.get("/",(req, res)=>{
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