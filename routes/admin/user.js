var express = require('express');
var router = express.Router();
var passport = require('passport');

var settings = require('../../config/settings');
var restrict = require('../../middlewares/auth/restrict');
var adminService = require('../../services/admin/admin-user-service');

//main or index page for the admin
router.get('/', function(req, res, next){
	//check if the user is logged in
	if(req.user){
		return res.render('admin/dashboard');
	}

	//user is not logged in
	var inputs_and_values = {
		admin_route: true,
		tenant_name: req.tenant.name,
		title: 'Login page',
		currently_on_login_page: 'login_page',
		error: req.flash('error')
	};
	res.render('user/login', inputs_and_values);// we use the form used in the front end
});


//get the login form
router.get('/login', function(req, res, next){
	var inputs_and_values = {
		admin_route: true,
		tenant_name: req.tenant.name,
		title: 'Login Page',
		currently_on_login_page: 'login_page',
		error: req.flash('error')
	};
	res.render('admin/login', inputs_and_values);
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
		failureRedirect: '/admin/login',
		successRedirect: '/admin/dashboard',
		failureFlash: 'Invalid credentials'
	})
);

//get the registration form page
router.get('/register', restrict, function(req, res, next){
	
	var inputs_and_values = {
		admin_route: true,
		tenant_name: req.tenant.name,
		admin_first_name: req.user.profile.first_name,
		title: 'Registration page',
		currently_on_registration_page: 'registration_page'
	};
	res.render('admin/register', inputs_and_values);
});

//post to the registration page
router.post(
	'/register',
	restrict,
	function(req, res, next){
		adminService.addUser(req.body, req.tenant._id, function(err){
			if(err){
				//an error was sent back
				var inputs_and_values = {
					admin_route: true,
					tenant_name: req.tenant.name,
					admin_first_name: req.user.profile.firstname,
					title: 'Registration page',
					input: req.body,
					error: err.errors
				};
				//delete inputs_and_values.input.password;
				return res.render('admin/register', inputs_and_values);
			}

			//registration was successful
			req.login(req.body, function(err){
				res.redirect('/admin/dashboard');
			});
		});
	}
);

//get the logout action
router.get('/logout', function(req, res, next){
	req.logout();
	req.session.destroy(); //destroy the session
	res.redirect('/admin/login');
});

module.exports = router;