const express = require('express');
const routers = require("./routers");
const app = express();
const ejs = require('ejs');
const dotenv = require("dotenv");
const path = require("path");

const cookieParser = require('cookie-parser')

app.use(cookieParser())


app.use(express.urlencoded({ extended: false}))

app.set("view engine", "ejs");

//express body middleware
app.use(express.json());



//router middleware
app.use("/", routers);



//Static Files
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.status(404).send(
        "<h1>Page not found on the server</h1>")
})
//Environment variables
dotenv.config({
    path : './config/env/config.env'
});
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Client started on ${PORT} : ${process.env.NODE_ENV}`);
});