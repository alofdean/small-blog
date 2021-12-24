const express = require("express");
const router = express.Router();
const auth = require("./auth");
const profile = require("./profile");
const axios = require('axios');
const lodash = require('lodash');
const { getLoggedInUser } = require("../middlewares/authorization/auth");

router.get("/",getLoggedInUser,(req,res,next) => {
  const API_URL = process.env.API_URL + `/article?sortBy=${req.query.sortBy || ""}&page=${req.query.page || ""}&search=${req.query.search|| ""}`
    axios.get(API_URL)
      .then((response) => {
        if (response.data.success) {
          const articles = response.data.data;
          res.render("home",{
            req : req,
            articles : articles,
            lodash : lodash
          });
        }
      }, (error) => {
          return console.log(error);
      });
})

router.get("/article/:slug",getLoggedInUser,(req,res,next) => {
  const slug = req.params.slug;
  const API_URL = process.env.API_URL + `/article/${slug}`
    axios.get(API_URL)
      .then((response) => {
        if (response.data.success) {
          let article = response.data.data

          let array = article.user.name.split(" ")   
          let name = " "   
          for( let i = 0; i < array.length; i++ ) {  
               name += lodash.upperFirst(array[i]) + " "  
          }  

          article.user.name = name  
          res.render("article",{
            req: req,
            article : article
          })
        }
      }, (error) => {
          return console.log(error);
      });

})

router.post("/search",(req,res,next) => {
  const searchKey = req.body.search
  res.redirect(`/?search=${searchKey}`);
})

router.use("/auth",getLoggedInUser,auth);


router.use("/profile",getLoggedInUser,profile);

module.exports = router;