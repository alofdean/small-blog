
const axios = require('axios');
const FormData = require('form-data');
const lodash = require('lodash');


const userEdit = async(req,res,next) => {
    const file = req.file;
    const form = new FormData();
    form.append('name', req.body.name);
    form.append('email', req.body.email);

    if (req.body.password) {
        form.append('password', req.body.password);
    }
    if(file){
      form.append('profile_image', file.buffer, file.originalname);
    }
    
    try {
        const response = await axios.put(`http://localhost:4000/api/auth/edit`, form, {
            headers: {
            ...form.getHeaders(),
            Authorization: 'Bearer: ' + req.cookies.access_token // optional
            },
        });
        res.redirect('/');
    } catch (error) {
        
            return res.render("settings",{
                req:req,
                err: error.response.data
            })
        
        
    }
}

const getUserArticles = async(req,res,next) => {
    const API_URL = process.env.API_URL + `/article?sortBy=${req.query.sortBy || "most-liked"}&page=${req.query.page || ""}&userId=${req.query.userId|| ""}`
    try {
      const response = await axios.get(API_URL)
      if (response.data.success) {
        const articles = response.data.data;
        res.render("user-blogs",{
          req : req,
          result: response.data,
          articles : articles,
          lodash : lodash
        });
      }
    } catch (error) {
        console.log(error.response);
    }
}

const getReadingList = async(req,res,next) => {

    let articles =  req.user.data.reading_list;

    res.render("reading-list",{
            req: req,
            articles: articles,
            lodash:  lodash
    })
}

const postNewArticle = async(req,res,next) => {
    const file = req.file;
    const form = new FormData();
    form.append('title', req.body.title);
    form.append('description', req.body.description);
    form.append('content', req.body.content);
    form.append('article_image', file.buffer, file.originalname);
    
    try {
        const response = await axios.post("http://localhost:4000/api/article/create", form, {
            headers: {
            ...form.getHeaders(),
            Authorization: 'Bearer: ' + req.cookies.access_token // optional
            },
        });
        res.redirect('/articles/'+ response.data.data.slug);
    } catch (error) {
        res.render("new-article",{
            req:req,
            err: error.response.data
        })
    }
}

const newComment = async(req,res,next) => {
    const refUrl = req.headers.referrer || req.headers.referer;
    const content = req.body.content;

    try {
        const options ={
            method: 'post',
            url: `http://localhost:4000/api/article/${req.params.id}/comment`,
            headers: {
              'Authorization': 'Bearer: ' + req.cookies.access_token
            },
            data: {
                content: content
            },
            crossdomain: true
        }
        await axios(options);
        res.redirect(refUrl+"#comments")
    } catch (error) {
        return res.render("error",{
            req:req,
            error:{
              status: error.response.status,
              title: error.response.statusText,
              message: error.response.data.message
            }
          })
    }
}
module.exports = {
    userEdit,
    getUserArticles,
    getReadingList,
    postNewArticle,
    newComment
}