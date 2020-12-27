//jshint esversion:6

const express= require("express");
const ejs=require("ejs");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

mongoose.connect("mongodb://localhost:27017:/userDB",{ useNewUrlParser: true , useUnifiedTopology: true });

const userSchema= new mongoose.Schema({
    email: String,
    password: String
});

const secret="ThisismylittleSecret."
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});
const User=new mongoose.model("User",userSchema);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/",function(req,res){
    res.render("home");
});
app.route("/login")
    .get(function(req,res){
        res.render("login");
    })
    .post(function(req,res){
        const username=req.body.username;
        const password=req.body.password;

        User.findOne({email: username},function(err,foundUser){
            if(err)
                console.log(err);
            else{
                if(foundUser){
                    console.log(foundUser);
                    if(foundUser.password===password){
                        res.render("secrets");
                    }
                }
                
            }
        });
    })
app.route("/register")
    .get(function(req,res){
        res.render("register");
    })
    .post(function(req,res){
        const newUser=new User({
            email: req.body.username,
            password: req.body.password
        });

        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
    });


app.listen(3000,function(){
    console.log("Server started at port 3000");
});