//load the user class
var User = require('../models/user').User;
var bCrypt = require('bcrypt-nodejs');


//define a function for adding a user
exports.addUser = function(user, tenant_id, next){
	//assign variable to a new instance of our class
	var newUser = new User({
		t_id: tenant_id,
		email: user.email.toLowerCase(),
		password: createHash(user.password),
		admin: false,
		profile: {
			first_name: user.first_name,
			last_name: user.last_name
		},
		account: {
			pay_on_checkout: true,
			pay_tax: false,
			customer_group: 'WHOLESALE',
			role: 0
		}
	});

	newUser.pre("save", function(next) {
		var self = this;

		User.findOne(
		{
			email: this.email.toLowerCase(),
			t_id: this.t_id,
			admin: false
		},
		function(err, user){
			if(err) {
	            next(err)
	        } else if(user) {
	            self.invalidate("email", "That email is already registered")
	            next(err)
	        } else {
	            next()
	        }
	        
		}
		);


	    
	});

	//insert the data into our db
	newUser.save(function(err){
		if(err) return next(err);

		next(null);
	});
};


//function to check if a user exists
exports.findUser = function(email,tenant_id, next){
	//console.log(tenant_id);
	User.findOne(
		{
			email: email.toLowerCase(),
			t_id: tenant_id
		},
		function(err, user){
			next(err,user);
		}
	);
};

//Generate has using bCrypt
var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};