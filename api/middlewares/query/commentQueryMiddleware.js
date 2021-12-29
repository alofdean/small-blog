
const asyncErrorHandler = require("express-async-handler");
const {populateHelper, paginationHelper } = require("./queryMiddlewareHelpers");

const commentQueryMiddleware = function (model,options) {
    
    return asyncErrorHandler(async function(req,res,next){
        //initial query
        const articleId = req.params.id;
        let query =  model.find({
            article : articleId
        });
        
        if (options && options.population) {
            query = populateHelper(query,options.population);
        }
        
        //pagination
        const paginationResult = await paginationHelper(model,query,req);

        const pagination =  paginationResult.pagination;

        const queryResults = await paginationResult.query;
        res.queryResults = {
            success : true,
            count : queryResults.length,
            pagination : pagination,
            data : queryResults
        };
        next();
    });
}

module.exports = commentQueryMiddleware;