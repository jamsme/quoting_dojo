var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var path = require('path');
const flash = require('express-flash');
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

mongoose.connect('mongodb://localhost/quoting');
var UserSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3},
    quote: {type: String, required: true, minlength: 5}
    }, {timestamps: true})
mongoose.model('User', UserSchema);
var User = mongoose.model('User')



app.get('/', function(reg, res){
    res.render('index')
});

app.post('/quote', function(req, res){
    console.log("POST DATA", req.body);
    var user = new User({name: req.body.name, quote: req.body.quote});
    user.save(function(err){
        if(err) {
            console.log('We have an error!', err);
            for(var key in err.errors){
                req.flash('registration', "name or quote needs to be longer")
            }
            res.redirect('/');
        } else { 
            console.log('successfully added a quote!');
            res.redirect('/skip');
        }
    })
});

app.get('/skip', function(req, res){

    User.find({}, function(err, users){
        if(err) {
            console.log("what went wrong")
        } else {
            console.log("go quote go!!!")
        }
        res.render('quotes', {quotes: users});
    }).sort({_id: -1})
});

app.get('/another', function(req, res){
    res.redirect('/')
})

app.listen(6100, function() {
    console.log("listening on port 6100");
})
