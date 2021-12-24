const express = require("express");
const axios = require('axios');



const router = express.Router();

router.get("/settings",(req,res,next) => {
    if (!req.user) {
        res.redirect("/")
    }
    res.render("settings")
})

module.exports = router;