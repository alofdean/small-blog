const axios = require('axios');

const getLoggedInUser = async(req,res,next) => {
    const API_URL = process.env.API_URL + "/auth/profile"
    const options ={
        method: 'get',
        url: API_URL,
        headers: {'Authorization': 'Bearer: ' + req.cookies.access_token}
    }
    try {
        const response = await axios(options)
        if (response.data.success) {
            req.user =response.data;
            next();
        }
    } catch (error) {
        if (error.response.status === 401) {
            next()
        }else {
            console.log(error);
        }
    }
} ; 

const getAuth = async(req,res,next) => {
      if (!req.user) {
        return res.render("error",{
          req:req,
          error:{
            status:401,
            title:"Unauthorized",
            message: "You are not authorized to access this route"
          }
        })
      }
      next();
} ; 





module.exports = {
    getLoggedInUser,
    getAuth
}