const express = require("express");
const router = express.Router();

//POSTS ROUTES

//Index - posts
router.get("/",(req, res) => {
    res.send("GET for posts");
});
//Show - posts
router.get("/:id",(req, res)=>{
    res.send("GET for show posts");
});
//Post  - posts
router.post("/",(req, res)=>{
    res.send("POST for posts");
});

//DELETE - posts
router.delete("/:id",(req, res)=>{
    res.send("DELETE for posts");
});

module.exports = router;