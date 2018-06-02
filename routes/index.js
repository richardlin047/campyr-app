var express = require("express");
var router = express.Router();
var User = require("../models/user.js");
var passport = require("passport");

// route route
router.get("/", function(req, res) {
    res.render("landing.ejs");
})

// ================
// AUTH ROUTES
// ================

// show register form
router.get("/register", function(req, res){
    res.render("register.ejs");
});

// handles sign up logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message); //show the given error
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Campyr " + user.username);
            res.redirect("/campgrounds");
        });
    });
})

//==============
// Login Routes
//==============
//show login form
router.get("/login",function(req,res){
    res.render("login.ejs");
});

// handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req,res){
});

// logout route
router.get("/logout", function(req,res){
    req.logout;
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;