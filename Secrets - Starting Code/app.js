//jshint esversion:6

require("dotenv").config();
const express= require("express");
const ejs=require("ejs");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017:/userDB",{ useNewUrlParser: true , useUnifiedTopology: true });
mongoose.set("useCreateIndex",true);
const userSchema= new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User=new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, done) {
      
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

app.get("/",function(req,res){
    res.render("home");
});
app.route("/login")
    .get(function(req,res){
        res.render("login");
    })
    .post(function(req,res){
        const user=new User({
            username: req.body.username,
            password: req.body.password
        });

        req.logIn(user, function(err){
            if(err)
                console.log(err);
            else{
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/secrets");
                })
            }
        })
    });
app.route("/register")
    .get(function(req,res){
        res.render("register");
    })
    .post(function(req,res){
        User.register({username: req.body.username}, req.body.password, function(err,user){
            if(err){
                console.log(err);
                res.redirect("/register");
            }else{
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/secrets");
                });
            }
        });
       
    });

app.route("/secrets")
    .get(function(req,res){
        User.find({"secret": {$ne: null }}, function(err, foundUser){
            if(err)
                console.log(err);
            else{
                if(foundUser){
                    res.render("secrets", {userWithSecrets: foundUser});
                }
            }
        }); 
    });

app.route("/submit")
    .get(function(req,res){
        if(req.isAuthenticated()){
            res.render("submit");
        }else{
            res.redirect("/login");
        }
    })
    .post(function(req,res){
        const submittedSecret=req.body.secret;
        //Once the user is authenticated and their session gets saved, their user details are saved to req.user.
        //console.log(req.user.id);
        User.findById(req.user.id, function(err, foundUser){
            if(err)
                console.log(err);
            else{
                if(foundUser){
                    foundUser.secret=submittedSecret;
                    foundUser.save(function(){
                        res.redirect("/secrets");
                    });
                }
            }
        })
  
    });

app.route("/logout")
    .get(function(req,res){
        req.logOut();
        res.redirect("/");
    });

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/secrets", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) {
      res.redirect("/secrets");
    });
  
    
app.listen(3000,function(){
    console.log("Server started at port 3000");
});