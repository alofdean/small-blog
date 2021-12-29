const multer  = require('multer');
const CustomError = require('./CustomError');

const fileFilter = (req,file,cb) => {
    let allowedMimeTypes = ["image/jpg","image/gif","image/jpeg","image/png"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new CustomError("please provide a valid image file",400),false);
    }
    return cb(null,true);
    
};


const upload = multer({fileFilter})

module.exports = upload;