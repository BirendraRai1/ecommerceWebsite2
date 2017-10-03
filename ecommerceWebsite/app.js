var express=require('express');
var app=express();
var mongoose=require('mongoose');
var session=require('express-session');
var logger=require('morgan');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var path=require('path');

app.use(logger('dev'));
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

app.use(session({
	name:'myCustomCookie',
	secret:'myAppSecret',
	resave:true,
	httpOnly:true,
	saveUninitialized:true,
	cookie:{secure:false}
}));

app.set('view engine','jade');
app.set('views',path.join(__dirname+'/app/views'));

var dbPath="mongodb://localhost/ecommerceWebsite"
//command to connect with the database
db=mongoose.connect(dbPath);
mongoose.connection.once('open',function(){
	console.log("database connection open success");
});

//default module for file management in node js
//including models
var fs=require('fs');
fs.readdirSync('./app/models').forEach(function(file){
	if(file.indexOf('.js')){
		require('./app/models/'+file);
	}
});


var auth=require('./middleWares/auth');
var mongoose=require('mongoose');
var userModel=mongoose.model('User');

app.use(function(req,res,next){
	if(req.session && req.session.user){
		userModel.findOne({'email':req.session.user.email},function(err,user){
			if(user){
				req.user=user;
				delete req.user.password;
				req.session.user=user;
				delete req.session.user.password;
				next();
			}
			else{
				//nothing to do
			}
		});
	}
	else{
		next();
	}
});

//including controllers
fs.readdirSync('./app/controllers').forEach(function(file){
	if(file.indexOf('.js')){
		var route=require('./app/controllers/'+file);
		route.controllerFunction(app);
	}
});


app.use(function(err,req,res,next){
	res.status(err || 500);
	res.render('error',{
		message:err.message,
		error:err
	});
});
app.listen(3000,function(){
	console.log('Example app listening on port 3000!')
});

