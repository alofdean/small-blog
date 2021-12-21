const CustomError = require('../../helpers/error/CustomError');
const asyncErrorHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const {isTokenIncluded, getAccessTokenFromHeader} = require('../../helpers/authorization/tokenHelpers');


const getAccessToRoute = (req,res,next) => {
    // check token and get access to route
    const {JWT_SECRET_KEY} = process.env;
    if (!isTokenIncluded(req)) {
        // 401 = unauthorized not sign in
        // 403 = Forbidden sign in but not have permission such as normal user is trying to access route that only admin have a permission 
 
        return next(new CustomError("You are not authorized to access this route",401));
    }
    const accessToken = getAccessTokenFromHeader(req);

    jwt.verify(accessToken,JWT_SECRET_KEY,(err,decoded) => {
        if (err) {
            return next(new CustomError("You are not authorized to access this route",401));
        }
        req.user = {
            id : decoded.id,
            name : decoded.name
        };
        next();
    });
}; 

const getAdminAccess = asyncErrorHandler(async(req,res,next) => {
    const {id} = req.user;

    const user = await User.findById(id);
    if(user.role !== "admin"){
        return next(new CustomError("Only admins can access this route",403))
    }
    next();
});

module.exports = {
    getAccessToRoute,
    getAdminAccess
}