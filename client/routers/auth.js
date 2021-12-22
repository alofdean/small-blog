const express = require("express");
const { register } = require("../controllers/register");
 
const router = express.Router();


router.get("/register", (req,res,next) => {
    
    res.render("sign-up")
});

router.post("/register", register);

module.exports = router;