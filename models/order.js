var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
	t_id: {type: String, required: 'Host not set', index: true},
	customer: {type: String, required: 'Customer ID is required', index: true},
	purchase_number: String,
	billing: {
		first_name: String,
		last_name: String,
		email: String,
		phone: String,
		fax: String,
		zipcode: String,
		street: String,
		city: String,
		state: String,
		country: String,
		company: String,
		payment_made: {type: Boolean, default: false},
		payment_mode: {type: String, enum:['CASH', 'AUTHORIZE.NET', 'STRIPE', 'PAYPAL']}
	},
	shipping: {
		first_name: String,
		last_name: String,
		email: String,
		phone: String,
		fax: String,
		zipcode: String,
		street: String,
		city: String,
		state: String,
		country: String,
		company: String,
		shipping_mode: String,
		shipping_service_option: String,
		shipping_cost: Number,
		shipping_date: Date,
		tracking_number: String,
		expected_date_of_delivery: String
	},
	costs: {
		items_total: {type: Number, default: 0},
		auto_discount: {type: Number, default: 0},
		discount: {type: Number, default: 0},
		shipping: {type: Number, default: 0},
		sub_total: {type: Number, default: 0},
		total: {type: Number, default: 0}
	}
	items: [],
	coupon_codes: [],
	message: String,
	status: {type: String, uppercase: true, enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'CANCELLED']},
	cancel_date: Date,
	created_at: {type: Date, default: Date.now},
	last_updated_at: Date
});

var Order = mongoose.model('Order', orderSchema);

module.exports = {
	Order : Order
};