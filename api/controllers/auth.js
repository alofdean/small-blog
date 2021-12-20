const User = require("../models/User");
const asyncErrorHandler = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
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


  module.exports = {
      register
  }