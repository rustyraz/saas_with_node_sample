var Product = require('../models/product').Product;


exports.findProductCategories = function(tenant_id, next){
	//we use this to query all the unique product categories
}

exports.findCategoryProducts = function(category, tenant_id, next){
	//we will find query products that are in a specified category
	Product.find(
	{
		category: category,
		t_id: tenant_id
	},
	function(err, products){
		next(err,products)
	}
	);
};

exports.findSingleProductDetails = function(id, tenant_id, next){
	Product.fincOne({_id: ObjectId(id)}, function(err, product){
		next(err,product);
	});
};