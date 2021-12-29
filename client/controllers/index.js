const axios = require('axios');
const lodash = require('lodash');


const loadHomePage =async(req,res,next) => {
    const API_URL = process.env.API_URL + `/article?sortBy=${req.query.sortBy || "most-liked"}&page=${req.query.page || ""}&search=${req.query.search|| ""}&userId=${req.query.userId|| ""}`
    try {
      const response = await axios.get(API_URL)
      if (response.data.success) {
        const articles = response.data.data;
        res.render("home",{
          req : req,
          result: response.data,
          articles : articles,
          lodash : lodash
        });
      }
    } catch (error) {
      return res.render("error",{
        req:req,
        error:{
          status: error.response.status,
          title: error.response.statusText,
          message: error.response.data.message
        }
      })
    }
    
};


const search = async(req,res,next) => {
    const searchKey = req.body.search
    res.redirect(`/?search=${searchKey}`);
}


module.exports = {
    loadHomePage,
    search
}