var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    superPagination = require('super-pagination').mongoose;
//var userService = require('../services/user-service');

var userSchema = new Schema({
	t_id: {type: String, required: 'Host not set', index: true},
	email: {type: String, required: 'Please enter your email address', index: true },
	password: {type: String, required: 'Please enter a password' },
	admin: {type: Boolean, default: false},	
	profile: {
		first_name: {type:String, required: 'Please enter your first name'},
		last_name: {type:String, required: 'Please enter your last name'},
		phone_number: String,
		fax: String,
		gender: String,
		photo: String,
		type_of_business: String,
		company: String,
		website: String
	},
	address: {
		latitude: Number,
		longitude: Number,
		zipcode: String,
		street: String,
		city: String,
		state: String,
		country: String
	},
	account: {
		active: {type: Boolean, default:true},
		role:{type: Number, enum: [0, 1, 2], default: 0},
		customer_group:{type: String, uppercase: true, enum: ['RETAIL', 'WHOLESALE']},
		notes: String,
		pay_tax: Boolean,
		tax_id: String,
		preferred_shipping: String,
		pay_on_checkout: {type: Boolean, default:true},
		assigned_sales_person: String,
		terms: String
	},
	reset_code: String,
	created_at: {type: Date, default: Date.now}
});


userSchema.plugin(superPagination, {
	theme: 'bootstrap'
});

var User = mongoose.model('User', userSchema);

module.exports = {
	User: User
};