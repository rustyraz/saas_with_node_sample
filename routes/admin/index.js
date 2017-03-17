var express = require('express');
var passport = require('passport');
var settings = require('../../config/settings');
var restrict = require('../../middlewares/auth/restrict');
var router = express.Router();

router.get('/', restrict,function(req, res, next){
	//check if the admin is logged in
	if(req.user){
		return res.render('/admin/dashboard');
	}else{
		var inputs_and_values = {
			title: 'Admin Dashboard',
			currently_on_dashboard_page: 'dashboard_page'
		};
		res.render('admin/login', inputs_and_values);
	}


});

//get the admin login form
router.get('/login', function(req, res, next){
	var inputs_and_values = {
		title: 'Admin Dashboard',
		currently_on_dashboard_page: 'dashboard_page'
	};
	res.render('admin/login', inputs_and_values);
});

//post the login form in the admin
router.post('/login', function(req,res,next){
	if(req.body.remember_me){
		req.session.cookie.maxAge = settings.cookieMaxAge;
	}
	next();
},
passport.authenticate('local',{
	failureRedirect: '/login',
	successRedirect: '/dashboard',
	failureFlash: 'Invalid login credentials used'
})
);

router.get('/dashboard',restrict,function(req,res,next){

	res.send('you are in the dashboard page');
});

module.exports = router;