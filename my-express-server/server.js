//jshint esversion:6

const express = require("express");

const app =express();

app.get("/",function(req,res){
    console.log(req)
    res.send("<h1>welcome to my first server</h1>")
})

app.listen(3000, function(){
    console.log("Server started on port 3000"); 
});