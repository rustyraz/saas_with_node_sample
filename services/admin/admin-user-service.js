var Admin = require('../../models/user').User;
var bCrypt = require('bcrypt-nodejs');

//define a function for adding a user
exports.addUser = function(user, tenant_id, next){
	//assign variable to a new instance of our class
	var newAdmin = new Admin({
		t_id: tenant_id,
		email: user.email.toLowerCase(),
		password: createHash(user.password),
		admin: true,
		profile: {
			first_name: user.first_name,
			last_name: user.last_name
		},
		account: {
			role: user.role			
		}
	});

	newAdmin.pre("save", function(next) {
		var self = this;

		Admin.findOne(
		{
			email: this.email.toLowerCase(),
			t_id: this.t_id,
			admin: true
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
	newAdmin.save(function(err){
		if(err) return next(err);

		next(null);
	});
};

//Generate has using bCrypt
var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
