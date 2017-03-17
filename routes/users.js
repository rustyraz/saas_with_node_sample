var express = require('express');
var router = express.Router();
var passport = require('passport');
var settings = require('../config/settings');
var userService = require('../services/user-service');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//get the login form
router.get('/login', function(req, res, next){
	var inputs_and_values = {
		title: 'Login Page',
		currently_on_login_page: 'login_page'
	};
	res.render('user/login', inputs_and_values);
});

//post to the login url
router.post(
	'/login', 
	function(req, res, next){
		//check if the remember ne input is set
		if(req.body.remember_me){
			req.session.cookie.maxAge = settings.cookieMaxAge;
		}
		next();
	},
	passport.authenticate('local',{
		failureRedirect: '/',
		successRedirect: '/orders',
		failureFlash: 'Invalid credentials'
	})
);

//get the registration form page
router.get('/register', function(req, res, next){
	var inputs_and_values = {
		title: 'Registration page',
		currently_on_registration_page: 'registration_page'
	};
	res.render('user/register', inputs_and_values);
});

//post to the registration page
router.post(
	'/register',
	function(req, res, next){
		userService.addUser(req.body, req.tenant._id, function(err){
			if(err){
				//an error was sent back
				var inputs_and_values = {
					title: 'Registration page',
					input: req.body,
					error: err.errors
				};
				//delete inputs_and_values.input.password;
				return res.render('user/register', inputs_and_values);
			}

			//registration was successful
			req.login(req.body, function(err){
				res.redirect('/orders');
			});
		});
	}
);

//get the logout action
router.get('/logout', function(req, res, next){
	req.logout();
	req.session.destroy(); //destroy the session
	res.redirect('/');
});

module.exports = router;