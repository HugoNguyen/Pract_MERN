const express = require('express'); //import express module

const app = express(); //new exxpress app web server

const fileServerMiddleware = express.static('public');//A middleware, to return a looking static file base on reqs

const port = 3000; // declare an arbitrary port, if using port 80, need to have adminsitrative privileges.

app.use('/',fileServerMiddleware);//Mount the middleware for this app.

app.listen(port,function(){
    console.log(`App started on port ${port}`);
});


