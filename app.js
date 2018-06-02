var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    Campground = require("./models/campground.js"),
    Comment = require("./models/comment.js"),
    User = require("./models/user.js"),
    seedDB = require("./seeds.js");
    
// requiring routes    
var commentRoutes = require("./routes/comments.js")
var campgroundsRoutes = require("./routes/campgrounds.js")
var indexRoutes = require("./routes/index.js")
    
// mongoose.connect("mongodb://localhost/campyr");
//connection url to remote server is hidden for safety
var databaseurl = process.env.DATABASEURL || "mongodb://localhost/campyr" //so theres a default
mongoose.connect(databaseurl);

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash()); 
// seedDB(); // seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({ //sets up cookies and sessions
    secret: "I have the cutest dog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware that runs for every route
//inside every template/route, currentUser is a variable equal to req.user
app.use(function(req, res, next){
    res.locals.currentUser = req.user; 
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRoutes);
//takes all campground routes, and appends /campground in front of them
app.use("/campgrounds", campgroundsRoutes); 
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Campyr Server is on!");
});
