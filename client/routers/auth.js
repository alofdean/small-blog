const express = require("express");
const { register, login, logout } = require("../controllers/auth");
const { getLoggedInUser } = require("../middlewares/authorization/auth");
 
const router = express.Router();


router.get("/register", (req,res,next) => {
    if (req.user) {
        res.redirect("/")
    }
    res.render("sign-up",{err:null})
});

router.get("/login", (req,res,next) => {
    if (req.user) {
        res.redirect("/")
    }
    res.render("sign-in",{err:null})
});


router.get("/logout",logout);

router.post("/register",register);

router.post("/login",login);

module.exports = router;