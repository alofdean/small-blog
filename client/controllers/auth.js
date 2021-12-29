const axios = require('axios');


const register = async(req,res,next) => {
  
    const API_URL = process.env.API_URL + "/auth/register"
    try {
      const response = await axios.post(API_URL, {
        ...req.body
      });
      if (response.data.success) {
        return res
        .status(200)
        .cookie("access_token", response.data.access_token,{
          httpOnly: true,
          expires : new Date(Date.now() + parseInt(10) *1000 * 60),
          // secure : NODE_ENV === "development" ? false : true
        }).redirect("/")
      }
    } catch (error) {
      return res.status(error.response.status).render("sign-up",{err : error.response.data})
    }


};

const login = async(req,res,next) => {
  const API_URL = process.env.API_URL + "/auth/login"
  try {
    const response = await axios.post(API_URL, {
      ...req.body
    })

    if (response.data.success) {
        return res
        .status(200)
        .cookie("access_token", response.data.access_token,{
          httpOnly: true,
          expires : new Date(Date.now() + parseInt(10) *1000 * 60),
          // secure : NODE_ENV === "development" ? false : true
        }).redirect("/")
      }
  } catch (error) {
    
    return res.status(error.response.status).render("sign-in",{err : error.response.data})
  }
      
};


const logout = async(req,res,next) => {
  const API_URL = "http://localhost:4000/api/auth/logout"
  const options ={
      method: 'get',
      url: API_URL,
      headers: {
        'Authorization': 'Bearer: ' + req.cookies.access_token
      },
      crossdomain: true
  }
  try {
    const response = await axios(options)
    if (response.data.success) {
      res.clearCookie("access_token").redirect("/");
    }

  } catch (error) {
      res.redirect("/");
  }
      
};

module.exports = {
    register,
    login,
    logout
}


    