const express = require("express");
const axios = require('axios');
const upload = require('../helpers/multer')
const FormData = require('form-data');
const lodash = require('lodash');

const router = express.Router();

router.get("/settings",async(req,res,next) => {
    if (!req.user) {
        res.redirect("/")
    }
    res.render("settings",{
        req:req,
        err : null
    })
})

router.post("/edit",upload.single('profile-image'),async(req,res,next) => {
    

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
    console.log(form);
    
    try {
        const response = await axios.put(`http://localhost:4000/api/auth/edit`, form, {
            headers: {
            ...form.getHeaders(),
            Authorization: 'Bearer: ' + req.cookies.access_token // optional
            },
        });
        // console.log(response);
        res.redirect('/');
    } catch (error) {
        // console.log(error);
        if (error.response.data.message === "You are not authorized to access this route" ) {
            res.redirect('/auth/login')
        }else
        res.render("settings",{
            req:req,
            err: error.response.data
        })
    }
    
})

router.get("/",async(req,res,next) => {
    if (!req.user) {
        res.redirect("/")
    }
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
      console.log(error.response.data.message);
    }
})


router.get("/reading-list",async(req,res,next) => {
    if (!req.user) {
        return res.redirect("/")
    }

    let articles =  req.user.data.reading_list;

    res.render("reading-list",{
            req: req,
            articles: articles,
            lodash:  lodash
        })
    
    
    
})

router.get("/new-article",(req,res,next) => {
    if (!req.user) {
        res.redirect("/")
    }
    res.render("new-article",{
        req:req,
        err:null
    })
})

router.post("/new-article",upload.single('article-image'),async(req,res,next) => {
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
        if (error.response.data.message === "You are not authorized to access this route" ) {
            res.redirect('/auth/login')
        }else
        res.render("new-article",{
            req:req,
            err: error.response.data
        })
    }
})


router.post("/new-comment/:id",async(req,res,next) => {
    const refUrl = req.headers.referrer || req.headers.referer;
    const content = req.body.content;
    // console.log(req.cookies.access_token );
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
        const response = await axios(options);
        res.redirect(refUrl+"#comments")
    } catch (error) {
        if (error.response.data.message === "You are not authorized to access this route" ) {
            res.redirect('/auth/login')
        }else{  
         console.log(error);
        }
    }
})

module.exports = router;