const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require('path');
const routers = require('./routers')
const app = express();

//Environment variables
dotenv.config({
    path : './config/env/config.env'
});
const PORT = process.env.PORT;

// mongodb connect
connectDatabase();

// express- body middleware
app.use(express.json());

// Router Middleware
app.use("/api",routers)


// Error handler
app.use(customErrorHandler);







app.listen(PORT, () => {
    console.log(`App started on ${PORT} : ${process.env.NODE_ENV}`);
  });