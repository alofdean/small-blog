const express = require('express');
const routers = require("./routers");
const app = express();
const ejs = require('ejs');
const dotenv = require("dotenv");
const path = require("path");

app.set("view engine", "ejs");

//express body middleware
app.use(express.json());

//router middleware
app.use("/", routers);

//Static Files
app.use(express.static(path.join(__dirname, "public")));


//Environment variables
dotenv.config({
    path : './config/env/config.env'
});
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Client started on ${PORT} : ${process.env.NODE_ENV}`);
});