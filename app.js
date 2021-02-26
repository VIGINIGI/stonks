var express= require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var User = require("./models/user");
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
const { request } = require('express');


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/stonks");


var app = express();
app.set('view engine', 'ejs');

app.use(require("express-session")({
    secret: "zerodha stonks go down",
    resave: false,
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    next();
});
// ++++++++++
// Routes   +
// ++++++++++

app.get("/", function(req,res){

    res.render('land');
});

app.get("/home", isLoggedIn, function(req, res){
    res.render('home',{currentUser: req.user});
});

// SIGNUP

app.get("/signup", function(req,res){
    res.render('signup');
});

app.post("/signup", function(req,res){
    req.body.username
    req.body.fullname
    req.body.email
    req.body.password
    req.body.accNum
    req.body.balance
    User.register(new User({username: req.body.username, fullname: req.body.fullname, email: req.body.email, accNum: req.body.accNum, balance: req.body.balance }), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/home");
        });
    });
});

// LOGIN

app.get("/login", function(req,res){
    res.render('login');
});
// Login Logic
// Middleware
app.post("/login", passport.authenticate("local", {
   successRedirect: "/home",
   failureRedirect: "/login"
}) ,function(req,res){
});

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT||3000, process.env.ip, function(){
    console.log('Server started..');
});

