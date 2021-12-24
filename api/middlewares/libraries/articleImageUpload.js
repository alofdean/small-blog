
const multer = require('multer');
const path = require('path');
const CustomError = require('../../helpers/error/CustomError');

// storage , filefilter

const storage = multer.diskStorage({
    destination : function (req,file,cb) {
        const rootDir = path.dirname(require.main.filename);//server.js in konumunu belirtiyor
        cb(null,path.join(rootDir,"/public/uploads/article_images"));
    },
    filename : function (req,file,cb) {
        // File - mimetype - image/png
        const extension = file.mimetype.split("/")[1]; //=png
        req.savedArticleImage = Date.now() + '-' + Math.round(Math.random() * 1E9)+ "." +extension
        cb(null, req.savedArticleImage)
    }
});

const fileFilter = (req,file,cb) => {
    let allowedMimeTypes = ["image/jpg","image/gif","image/jpeg","image/png","application/json"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new CustomError("please provide a valid image file",400),false);
    }
    return cb(null,true);
    
};

const articleImageUpload = multer({storage,fileFilter})

module.exports = articleImageUpload;