const axios = require('axios');


const register = (req,res,next) => {
  
    const API_URL = process.env.API_URL + "/auth/register"
    axios.post(API_URL, {
        ...req.body
      })
      .then((response) => {
        if (response.data.success) {
          return res
          .status(200)
          .cookie("access_token", response.data.access_token,{
            httpOnly: true,
            expires : new Date(Date.now() + parseInt(10) *1000 * 60),
            // secure : NODE_ENV === "development" ? false : true
          }).redirect("/")

        }
      }, (error) => {
        return res.status(error.response.status).render("sign-up",{err : error.response.data})
        
      });
};

const login = (req,res,next) => {
  const API_URL = process.env.API_URL + "/auth/login"
    axios.post(API_URL, {
        ...req.body
      })
      .then((response) => {
        if (response.data.success) {
          return res
          .status(200)
          .cookie("access_token", response.data.access_token,{
            httpOnly: true,
            expires : new Date(Date.now() + parseInt(10) *1000 * 60),
            // secure : NODE_ENV === "development" ? false : true
          }).redirect("/")
        }
      }, (error) => {
        return res.status(error.response.status).render("sign-in",{err : error.response.data})
        
      });
};

module.exports = {
    register,
    login
}


    