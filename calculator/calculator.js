//jshint esversion:6

const express=require("express");
const bodyparser=require("body-parser");
const app=express();
app.use(bodyparser.urlencoded({extended: true}));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
    console.log(req.body);
    var ans=Number(req.body.num1)+Number(req.body.num2);
    res.send("Your result is "+ans);
});

app.listen(3000,function(){
    console.log("Server uis running on port 3000")
});