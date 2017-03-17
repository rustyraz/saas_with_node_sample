var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
	t_id: {type: String, required: 'Host not set', index: true},
	customer_session_id: {type: String, required: 'Customer ID is required', index: true},
	items: [],
	coupon_codes: [],
	created_at: {type: Date, default: Date.now},
	last_updated_at: Date,
	expires_at: Date
});

var Cart = mongoose.model('Cart', cartSchema);

module.exports = {
	Cart: Cart
};