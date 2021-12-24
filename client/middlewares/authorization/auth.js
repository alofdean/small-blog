const axios = require('axios');

const getLoggedInUser = (req,res,next) => {
    const API_URL = process.env.API_URL + "/auth/profile"
    const options ={
        method: 'get',
        url: API_URL,
        headers: {'Authorization': 'Bearer: ' + req.cookies.access_token}
    }
    axios(options)
      .then((response) => {
          if (response.data.success) {
              req.user =response.data;
              next();
          }
      }, (error) => {
          next()
      });
}; 

module.exports = {
    getLoggedInUser
}