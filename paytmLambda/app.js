//jshint esversion:6

const https = require('https');

const express = require("express");

const bodyParser = require("body-parser");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.send("Hello");
});

app.listen(3000,function(){
    console.log("Server started at 3000");
})