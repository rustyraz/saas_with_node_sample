var Customer = require('../../models/user').User;
var bCrypt = require('bcrypt-nodejs');

//define the function to list all the customers
exports.getCustomers = function(page,size,tenant_id, next){
	Customer.paginate({
		query:{
			t_id: tenant_id,
			admin: false
		},
		page: page || 1,
		select: '_id created_at email account.active profile.first_name profile.last_name',
		populate: null,
		sort: {
			'name': 1,
			'created_at' : -1
		},
		per_page: size || 10,
		url: 'admin/customers'
	},function(err, results, pagination){
		if(err){
			next(err);
		}

		next(err,results,pagination, render());
	});
};


//function to add a new customet
exports.addCustomer = function( customer, tenant_id, next){
	var newCustomer = new Customer({
		t_id: tenant_id,
		email: customer.email.toLowerCase(),
		password: createHash(customer.password),
		admin: false,
		profile: {
			first_name: customer.first_name,
			last_name: customer.last_name
		},
		account: {
			pay_on_checkout: true,
			pay_tax: false,
			customer_group: 'WHOLESALE',
			role: 0
		}
	});

	//before saving we check if the customer exists
	newCustomer.pre('save', function(next){
		var self = this;
		Customer.findOne({t_id:tenant_id, email:customer.email.toLowerCase(), admin: false}, function(err, customer){
			if(err){
				console.log(err);
				next(err);
			}else if(customer){
				self.invalidate('email', "A customer with that email address already exists");
				next(err);
			}else{
				next()
			}
		});
	});


	//save the customer
	newCustomer.save(function(err, docsInserted){
		if(err){
			console.log(err);
			return next(err);
		}

		next(null, docsInserted._id);
	});
};

//get a single customer by id
exports.findCustomer = function(id,tenant_id, next){
	Customer.findOne({_id: id, t_id: tenant_id}, function(err, customer){
		next(err,customer);
	});
}

//update the customer by id
exports.updateCustomer = function(updated_data, tenant_id, next){
	Customer.findOne({_id: updated_data._id, t_id: tenant_id}, function(err, customer){
		if(err){
			console.log(err);
			return next(err);
		}

		if(customer){

			customer.email = updated_data.email;
			customer.profile.first_name = updated_data.first_name;
			customer.profile.last_name = updated_data.last_name;
			customer.profile.phone_number = updated_data.phone_number;
			customer.profile.fax = updated_data.fax;
			customer.profile.company = updated_data.company;
			customer.address.zipcode = updated_data.zipcode;
			customer.address.street = updated_data.street;
			customer.address.city = updated_data.city;
			customer.address.state = updated_data.state;
			customer.address.country = updated_data.country;

			customer.account.customer_group = updated_data.customer_group;
			customer.account.notes = updated_data.notes;
			customer.account.assigned_sales_person = updated_data.assigned_sales_person;
			customer.account.terms = updated_data.terms;
			if(updated_data.active === '0'){
				customer.account.active = true;
			}else{
				customer.account.active = false;
			}

			if(updated_data.pay_on_checkout == '0'){
				customer.account.active = true;
			}else{
				customer.account.active = false;
			}
			

			//check if the customer exists
			customer.pre("save", function(next){
				var self = this;
				Customer.find({t_id:tenant_id, email: customer.email.toLowerCase()}, function(err, customers){
					if(err){
						console.log(err);
						next(err);
					}else if(customers){
						if(customers.length>0){
							if(customers.length>1 || (customers.length == 1 && customers._id != updated_data._id)){
								self.invalidate('email', "Another customer with that email address already exists");
								next(err);
							}else{
								next();
							}
						}else{
							next()
						}
					}else{
						next()
					}
				});
			});

			//all looks good to save
			customer.save(function(err){
				if(err){
					console.log(err);
					return next(err);
				}

				next(null);
			});

		}else{
			//customer not found
		}
	});
};

//delete customer
exports.deleteCustomer = function(id, tenant_id, next){
	//we use this to deletea the product
	Customer.findOne({ _id:id, t_id: tenant_id },function(err, customer){
		if(err){
			next(err);
		}else{
			customer.remove();
			next(null);
		}
	});
};

//Generate has using bCrypt
var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};