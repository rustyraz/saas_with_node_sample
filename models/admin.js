var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
	t_id: {type: String, required: 'Host not set', index: true},
	email: {type: String, required: 'Please enter your email address', index: true },
	password: {type: String, required: 'Please enter a password' },
	admin: {type: Boolean, default: false},	
	profile:{
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
	address:{
		latitude: Number,
		longitude: Number,
		zipcode: String,
		street: String,
		city: String,
		state: String,
		country: String
	},
	account:{
		active: {type: Boolean, default:true},
		role:{type: Number, enum: [0, 1, 2], default: 0},
		customer_group:{type: String, uppercase: true}
		notes: String,
		pay_tax: {type: Boolean, default:false},
		tax_id: String,
		preffered_shipping: String,
		pay_on_checkout: {type: Boolean, default:true},
		assigned_sales_person: {type:Number, default: 0},
		terms: String
	},
	reset_code: String,
	created_at: {type: Date, default: Date.now}
});

var Admin = mongoose.model('Admin', adminSchema);

module.exports = {
	Admin: Admin;
};