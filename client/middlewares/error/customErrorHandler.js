
const customErrorHandler = (err,req,res,next) => {
    let customError = err;
    if (err.message === "please provide a valid image file") {
        res.render("new-article",{
            req:req,
            err: err
        })
    }
    
    
};

module.exports = customErrorHandler;

