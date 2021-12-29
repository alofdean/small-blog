const express = require('express');
const routers = require("./routers");
const app = express();
const ejs = require('ejs');
const customErrorHandler = require('./middlewares/error/customErrorHandler')
const dotenv = require("dotenv");
const path = require("path");

const cookieParser = require('cookie-parser');
const { getLoggedInUser } = require('./middlewares/authorization/auth');

app.use(cookieParser())


app.use(express.urlencoded({ extended: false}))

app.set("view engine", "ejs");

//express body middleware
app.use(express.json());




//router middleware
app.use("/", routers);


app.use(customErrorHandler);




//Static Files
app.use(express.static(path.join(__dirname, "public")));

app.use(getLoggedInUser,(req, res, next) => {
    res.status(404).render("error",{
        req: req,
        error:{
            status: 404,
            title: "Page not found",
            message: "The page you're looking for was not found"

        }
    })
})
//Environment variables
dotenv.config({
    path : './config/env/config.env'
});
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Client started on ${PORT} : ${process.env.NODE_ENV}`);
});