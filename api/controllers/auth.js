const User = require("../models/User");
const asyncErrorHandler = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const {validateUserInput, comparePassword} = require("../helpers/input/inputHelpers");
const CustomError = require("../helpers/error/CustomError");


const register = asyncErrorHandler(async (req, res, next) => {
    const { name, email, password} = req.body;
  
    const user = await User.create({
      name,
      email,
      password
    });
  
    sendJwtToClient(user, res);
});


const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password} = req.body;

  if (!validateUserInput(email,password)) {
    return next(new CustomError("please check your input",400));
  };

  const user = await User.findOne({email}).select("+password");//find user and get password

  if (!comparePassword(password,user.password)) {
    return next(new CustomError("please check your credentials",400));
  };

  sendJwtToClient(user, res);
});

const getUser = asyncErrorHandler(async (req, res, next) => {
  const loggedInUser = await User.findById(req.user.id);
  
  return res.status(200)
    .json({
        success: true,
        data: loggedInUser
    });
});


const logout = asyncErrorHandler(async (req, res, next) => {
  //clear token from cookies 
  const {NODE_ENV} = process.env;

  return res.status(200)
  .clearCookie("access_token").json({
    success : true,
    message : "logout successfull"
  });
});

const imageUpload =  asyncErrorHandler(async (req, res, next) => {
  
  const user = await User.findByIdAndUpdate(req.user.id, {
    "profile_image" : req.savedProfileImage
  },{
    new:true,
    runValidators : true
  });

  res.status(200)
  .json({
    success: true,
    message: 'image upload successfull',
    data : user
  });
});

const editDetails = asyncErrorHandler(async (req, res, next) => {
  const editInformation = req.body;
  
  const user = await User.findByIdAndUpdate(req.user.id,editInformation,{
    new:true,
    runValidators: true
  });
  

  res.status(200)
  .json({
    success: true,
    data: user
    
  });


});

  module.exports = {
      register,
      login,
      getUser,
      logout,
      imageUpload,
      editDetails
  }