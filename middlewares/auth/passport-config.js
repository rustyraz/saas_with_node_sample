module.exports = function(){
	var passport = require('passport');
	var passportLocal = require('passport-local');
	var userService = require('../../services/user-service');
	var bCrypt = require('bcrypt-nodejs');

	passport.use(new passportLocal.Strategy(
		{usernameField: 'email', passReqToCallback: true},
		function(req, email, password, next){
			userService.findUser(email, req.tenant._id, function(err, user){
				if(err){
					return next(err);
				}

				//check for non existing user
				if(!user){
					return next(null,null);
				}

				//found user compare password now
				if(!isValidPassword(user, password)){
					return next(null,null);
				}
				next(null, user);
			});
		}
	));

	//serialize the user
	passport.serializeUser(function(user, next){
		next(null, user.email);
	});

	//deserialize the user by checking for existence in the db
	passport.deserializeUser(function(req, email, next){
		userService.findUser(email,req.tenant._id, function(err, user){
			next(err, user);
		});
	});


	//chcek the user password with the user saved password
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
};