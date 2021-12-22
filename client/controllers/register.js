const axios = require('axios');
const register = async (req,res,next) => {
    const API_URL = process.env.API_URL + "/auth/register"
    axios.post(API_URL, {
        ...req.body
      })
      .then((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      });
    
};

module.exports = {
    register
}