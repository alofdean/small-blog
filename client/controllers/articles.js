
const axios = require('axios');
const FormData = require('form-data');
const lodash = require('lodash');


const getArticle = async(req,res,next) => {
    //comments
    const slug = req.params.slug;
    const API_URL1 = process.env.API_URL + `/article/${slug}`
    try {
      const response = await axios.get(API_URL1)
      if (response.data.success) {
        let article = response.data.data

        let array = article.user.name.split(" ")   
        let name = " "   
        for( let i = 0; i < array.length; i++ ) {  
            name += lodash.upperFirst(array[i]) + " "  
        }  
        //comments

        const API_URL2 = process.env.API_URL + `/article/${article._id}/comment?&page=${req.query.page || ""}&search=0`
        let comments =[];
        const options ={
            method: 'get',
            url: API_URL2,
        }
        try {
          const response = await axios(options);
          if (response.data.success) {
              comments = response.data;
          }
        } catch (error) {
          console.log(error);
        }

        article.user.name = name  
        res.render("article",{
          req: req,
          article : article,
          comments: comments
        })
      };
    } catch (error) {
      console.log(error.response.data.message);
    }
}

const likeArticle = async(req,res,next) => {
  
  const API_URL = process.env.API_URL + `/article/${req.params.id}/like`
  const options ={
      method: 'get',
      url: API_URL,
      headers: {'Authorization': 'Bearer: ' + req.cookies.access_token}
  }
  try {
    const response = await axios(options);
    if (response.data.success) {
        return res.send(response.data.success)
    }
  } catch (error) {
    if (error.response.status === 401) {
      return res.send(error.response.data.success)
    }else {
      console.log(error.response);
    }
  }
}

const unlikeArticle = async(req,res,next) => {
  
  const API_URL = process.env.API_URL + `/article/${req.params.id}/undo_like`
  const options ={
      method: 'get',
      url: API_URL,
      headers: {'Authorization': 'Bearer: ' + req.cookies.access_token}
  }
  try {
    const response = await axios(options);
    if (response.data.success) {
        return res.send(response.data.success)
    }
  } catch (error) {
    if (error.response.status === 401) {
      return res.send(error.response.data.success)
    }else {
      console.log(error.response);
    }
  }
  
}

const addList = async(req,res,next) => {
  const API_URL = process.env.API_URL + `/article/${req.params.id}/add`
  const options ={
      method: 'get',
      url: API_URL,
      headers: {'Authorization': 'Bearer: ' + req.cookies.access_token}
  }
  try {
    const response = await axios(options);
    if (response.data.success) {
        return res.send(response.data.success)
    }
  } catch (error) {
    if (error.response.status === 401) {
      return res.send(error.response.data.success)
    }else {
      console.log(error.response);
    }
  }
}

const removeFromList = async(req,res,next) => {
  const API_URL = process.env.API_URL + `/article/${req.params.id}/remove`
  const options ={
      method: 'get',
      url: API_URL,
      headers: {'Authorization': 'Bearer: ' + req.cookies.access_token}
  }
  try {
    const response = await axios(options);
    if (response.data.success) {
        return res.send(response.data.success)
    }
  } catch (error) {
    if (error.response.status === 401) {
      return res.send(error.response.data.success)
    }else {
      console.log(error.response);
    }
  }
}



const deleteArticle = async(req,res,next) => {
  
  const API_URL = process.env.API_URL + `/article/${req.params.id}/delete`
  const options ={
      method: 'delete',
      url: API_URL,
      headers: {'Authorization': 'Bearer: ' + req.cookies.access_token}
  }
  try {
    const response = await axios(options);
    if (response.data.success) {
        return res.send(response.data.success)
    }
  } catch (error) {
    if (error.response.status === 401) {
      return res.send(error.response.data.success)
    }else {
      console.log(error.response);
    }
  }
  
}


const editArticle = async(req,res,next) => {
  
    const file = req.file;
    const form = new FormData();
    form.append('title', req.body.title);
    form.append('description', req.body.description);
    form.append('content', req.body.content);
    if(file){

      form.append('article_image', file.buffer, file.originalname);
    }
    // console.log(form);
    
    try {
        const response = await axios.put(`http://localhost:4000/api/article/${req.params.id}/edit`, form, {
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
}

const showEditPage = async(req,res,next) => {

  let article;
  const slug = req.params.slug;
  const API_URL1 = process.env.API_URL + `/article/${slug}`
  try {
    const response = await axios.get(API_URL1)
    article = response.data.data
    if (article.user._id === req.user.data._id) {
      return res.render("article-edit",{
        req:req,
        article: article,
        err:null
      })
    }else {
      return res.render("error",{
        req:req,
        error:{
          status:403,
          title:"Forbidden",
          message: "Only owner can handle this operation"
        }
      })
    }
  } catch (error) {
    console.log(error);
  }
}



module.exports= {
    getArticle,
    likeArticle,
    unlikeArticle,
    deleteArticle,
    addList,
    removeFromList,
    editArticle,
    showEditPage
}