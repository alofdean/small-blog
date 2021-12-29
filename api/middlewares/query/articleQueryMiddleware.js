
const asyncErrorHandler = require("express-async-handler");
const { searchHelper,populateHelper,articleSortHelper, paginationHelper } = require("./queryMiddlewareHelpers");


const articleQueryMiddleware = function (model,options) {
    
    return asyncErrorHandler(async function(req,res,next){
        //initial query
        let query ;

        if (req.query.userId) {
            query = model.find({
                user: req.query.userId
            });
        }else{
            query = model.find();
        }

        //search
        query = searchHelper("title",query,req);

        if (options && options.population) {
            query = populateHelper(query,options.population);
        }
        //sortby
        query = articleSortHelper(query,req);

        //pagination
        const paginationResult = await paginationHelper(model,query,req);

        query = paginationResult.query;
        const pagination = paginationResult.pagination;

        const queryResults = await query;

        res.queryResults = {
            success : true,
            count : queryResults.length,
            pagination : pagination,
            data : queryResults
        };
        next();
    });
}

module.exports = articleQueryMiddleware;