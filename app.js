var express= require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var User = require("./models/user");
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
const { request } = require('express');
var stock = require('./models/stock');


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/stonks");


var app = express();
app.set('view engine', 'ejs');
app.use(express.json());

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
    stock.find({}, function(err, allStocks){
        if(err){
            console.log("Error; the world is against you.");
            console.log(err);
        }
        else{
            res.render("home", {stock: allStocks, currentUser: req.user});
        }
    });
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
    req.body.number

    User.register(new User({username: req.body.username, fullname: req.body.fullname, email: req.body.email, accNum: req.body.accNum, balance: req.body.balance, number:  req.body.balance}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/home");
        });
    });
});

app.post("/stock",  
function(req,res){
    stock.create({name: req.body.name,
        desc: req.body.desc,
        industry: req.body.industry,
        price: req.body.price,            
        sym: req.body.sym,
        numStocks: req.body.numStocks}, function(err, newlyCreated){
        if(err){
            console.log("Error; the world is against you.");
            console.log(err);
        }
        else{
            // res.redirect("/stock"); 
            console.log(req.body);
            res.send(newlyCreated); 

        }
    });
    // const stock = new stock({name: req.body.name,
    //     desc: req.body.desc,
    //     industry: req.body.industry,
    //     price: req.body.price,               
    //     sym: req.body.sym,
    //     numStocks: req.body.numStocks});
    //   const stockdata = await stock.save();
    //   res.send(stockdata);
    //   res.status(201).send({ message: "New Order Created", data: stockdata});
    
    
});
//profile
app.get("/profile", isLoggedIn,  function(req,res){
    // const data=user.find({username:currentUser});
    res.render('profile',{currentUser: req.user});
});
app.post("/update",function(req,res){
    User.updateOne({username:req.user},{$set:{fullname:req.body.full_name,number:req.body.mobile,
    accNum:req.body.bank_number,email:req.body.email}}, function(err, res) {
        if (err) {res.send(err);} });
    });
//portfolio
app.get("/portfolio", isLoggedIn, function(req,res){
    res.render('portfolio');
});
//transaction
app.get("/transaction", isLoggedIn, function(req,res){
    res.render('transaction');
});
//About Us
app.get("/aboutus", function(req,res){
    res.render('aboutus');
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

