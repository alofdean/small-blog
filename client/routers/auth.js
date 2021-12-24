const express = require("express");
const { register, login } = require("../controllers/auth");
const axios = require('axios');
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


router.get("/logout",(req,res,next) => {
    const API_URL = "http://localhost:4000/api/auth/logout"
        const options ={
            method: 'get',
            url: API_URL,
            headers: {
              'Authorization': 'Bearer: ' + req.cookies.access_token
            },
            crossdomain: true
        }
        axios(options)
          .then((response) => {
              if (response.data.success) {
                  res.clearCookie("access_token").redirect("/");
              }
          }, (error) => {
              if (error) {
                  res.redirect("/");
              }
          });
      
    
});

router.post("/register",register);

router.post("/login",login);

module.exports = router;