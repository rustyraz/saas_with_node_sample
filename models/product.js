var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    superPagination = require('super-pagination').mongoose;

var productSchema = new Schema({
	t_id: {type: String, required: 'Host not set', index: 1},
	category: [],
	price: [
	{
		group: {type: String, uppercase:true},
		value: Number
	}
	],
	price_per_qty:[
	{
		min_qty: {type: Number, min: 1},
		upper_range: {type: Number, max: 1, required: 'Price of the product is missing'}
	}
	],
	sku: {type:String, upppercase:true, index: 1 , required: 'Unique SKU/Code is required'},
	parent_sku: String,
	brand:{type: String, uppercase: true},
	name: {type: String, required: 'Product name is required'},
	short_desc:{type: String, required: 'Short description is required'},
	long_desc: String,
	image:{
		thumbnail:String,
		images:[]
	},
	minimum_qty_per_order: {type: Number, default: 1},
	stock:{type: Number, default: 1},
	shipping:{
		prod_height: Number,
		prod_width: Number,
		prod_length: Number,
		prod_weight: Number
	},
	reviews:[],
	use_discount: {type: Boolean, default: true},
	metadata: {
		title: String,
		keyword: String,
		description: String
	},
	attribute:{
		color: [{
			title: String
		}],
		model:[],
		size:[]
	},
	supplier: String,
	related_products: [],
	active: {type: Boolean, default: true},
	created_at: {type: Date, default: Date.now},
	last_updated_at: Date
});

productSchema.plugin(superPagination, {
	theme: 'bootstrap'
});

var Product = mongoose.model('Product', productSchema);

module.exports = {
	Product: Product
};