var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // is user logged in
    if (req.isAuthenticated()){
       Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // is user same as campground author?
                //cannot === because author.id is a mongoose object and user._id is a string
                if(foundCampground.author.id.equals(req.user._id)){ //
                    next();
                //otherwise redirect
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        }) 
    //else redirect    
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in
    if (req.isAuthenticated()){
       Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                req.flash("error", "Something went wrong");
                res.redirect("back");
            } else {
                // is user same as comment author?
                //cannot === because author.id is a mongoose object and user._id is a string
                if(foundComment.author.id.equals(req.user._id)){ //
                    next();
                //otherwise redirect
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        }) 
    //else redirect    
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

//MIDDLEWARE
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that") //doesnt flash right away; gives capability to display message
    res.redirect("/login");
}

module.exports = middlewareObj