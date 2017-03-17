var express = require('express');
var settings = require('../config/settings');
var fs = require('fs');

var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
	var fullUrl = req.protocol + '://' + req.hostname + req.originalUrl;
	
	console.log(req.tenant);
  	res.render('index', { title: fullUrl });
});

router.get('/home', function(req, res, next) {
	res.send(settings.imageUploadUrl);
	//var fullUrl = req.protocol + '://' + req.hostName + req.originalUrl;
  	//res.render('index', { title: req.path});
});

router.post('/', function(req, res, next){
	console.log(req.body);
	console.log(req.files);
	res.send('files');
});*/

router.get('/', function(req, res, next){
	//check if the user is logged in
	if(req.user){
		return res.render('/orders');
	}

	//user is not logged in
	var inputs_and_values = {
		title: 'Login page',
		currently_on_login_page: 'login_page',
		error: req.flash('error')
	};
	res.render('user/login', inputs_and_values);
});



module.exports = router;