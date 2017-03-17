var Product = require('../../models/product').Product;

//define the function to list all the products
exports.getProducts = function(page,size,tenant_id, next){

	/*Product.find()
	.where('t_id').equals(tenant_id)
	.skip(skip)
	.limit(limit)
	.exec(function(err, products){
		next(err, products);
	});*/


	Product.paginate({
	    query : {
	    	t_id: tenant_id
	    },
	    page : page || 1,
	    select : 'image.thumbnail name sku short_desc _id created_at',
	    populate : null,
	    sort : {
	    	'name': 1,
	        'created_at' : -1
	    },
	    per_page : size || 2,
	    url : '/admin/products'
	}, function(err, results, pagination){
	    if (err) {
	    	next(err);
	    };

	    next(err,results,pagination.render());

	});

	
};


//function to save a new product into the db
exports.addProduct = function(product, tenant_id, next){

	//console.log(req.body);
	var prices = product.price.split(',');
	//get the prices
	var price = [];
	for (var i = 0; i < prices.length; i++) {
		var arr = prices[i].split(':');
		if (arr[i] !== undefined) price.push({
			group: arr[0].toUpperCase(),
			value: arr[1]
		});			
	};

	var categories = product.category.split(',');



	//we use this to add a product into the db
	var newProduct = new Product({
		t_id: tenant_id,
		sku: product.sku.toUpperCase(),
		name: product.name,
		category: categories,
		price: price,
		short_desc: product.short_desc,
		long_desc: product.long_desc,
		parent_sku: product.parent_sku,
		brand: product.brand,
		minimum_qty_per_order: product.minimum_qty_per_order,
		stock: product.stock,
		shipping:{
			weight: product.prod_weight,
			height: product.prod_height,
			length: product.prod_length,
			width: product.prod_width
		},
		metadata:{
			title: product.title,
			keyword: product.keyword,
			description: product.description
		}
	});

	//before saving check if the product exists
	newProduct.pre("save", function(next){
		var self = this;
		Product.findOne({t_id:tenant_id, sku:product.sku.toUpperCase()}, function(err, product){
			if(err){
				console.log(err);
				next(err);
			}else if(product){
				self.invalidate('sku', "A Product with that SKU code already exists");
				next(err);
			}else{
				next()
			}
		});
	});

	//looks like we passed the test middleware
	newProduct.save(function(err,docsInserted){
		if(err) {
			console.log(err);
			return next(err);
		}

		next(null,docsInserted._id);
	});

};

exports.updateProduct = function(updated_data, tenant_id, next){
	//we use this to update a product
	Product.findOne({ _id: updated_data._id, t_id: tenant_id}, function(err, product){		
		//next(err,product);
		if(err){
			console.log(err);
			return next(err);
		}
		//next(null);
		if(product){

			//custom data reconstruction
			var prices = updated_data.price.split(',');
			//get the prices
			var price = [];
			for (var i = 0; i < prices.length; i++) {
				var arr = prices[i].split(':');
				if (arr[i] !== undefined) price.push({
					group: arr[0].toUpperCase(),
					value: arr[1]
				});			
			};
			var categories = updated_data.category.split(',');

			//set the updated data into the field
			product.name = updated_data.name;
			product.sku = updated_data.sku.toUpperCase();
			product.category = categories;
			product.price = price;
			product.parent_sku = updated_data.parent_sku.toUpperCase();
			product.brand = updated_data.brand;
			product.short_desc = updated_data.short_desc;
			product.long_desc = updated_data.long_desc;
			product.minimum_qty_per_order= updated_data.minimum_qty_per_order;
			product.stock = updated_data.stock;
			product.shipping.prod_weight = updated_data.prod_weight;
			product.shipping.prod_height = updated_data.prod_height;
			product.shipping.prod_width = updated_data.prod_width;
			product.shipping.prod_length = updated_data.prod_length;
			product.metadata.title = updated_data.title;
			product.metadata.keyword = updated_data.keyword;
			product.metadata.description = updated_data.description;

			//before saving check if the product exists
			product.pre("save", function(next){
				var self = this;
				Product.find({t_id:tenant_id, sku:product.sku.toUpperCase()}, function(err, products){
					if(err){
						console.log(err);
						next(err);
					}else if(products){
						if(products.length>0){
							if(products.length>1 || (products.length == 1 && products._id != updated_data._id)){
								self.invalidate('sku', "Another Product with that SKU code already exists");
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



			//looks like we passed the test middleware
			product.save(function(err){
				if(err) {
					console.log(err);
					return next(err);
				}

				next(null);
			});

		}else{
			//did not find a product
		}
	});

}

exports.updateProductThumbnail = function(prod_id, tenant_id, image, next){
	//we use this to update a product
			
	Product.findOne({ _id: prod_id, t_id: tenant_id}, function(err, product){		
		//next(err,product);
		if(err){
			console.log(err);
			return next(err);
		}
		//next(null);
		if(product){
			//an object of one image			
			product.image.thumbnail = image.name;				

			//looks like we passed the test middleware
			product.save(function(err){
				if(err) {
					console.log(err);
					return next(err);
				}

				next(null);
			});

		}else{
			//did not find a product
			next(false);
		}
	});

}

exports.updateProductImages = function(prod_id, tenant_id, images, next){
	//we use this to update a product
			
	Product.findOne({ _id: prod_id, t_id: tenant_id}, function(err, product){		
		//next(err,product);
		if(err){
			console.log(err);
			return next(err);
		}
		//next(null);
		if(product){
			//set the updated data into the field
			if( Object.prototype.toString.call(images) === '[object Array]' ) {
			    //we have many images in an array
				for (var i = 0; i < images.length; i++) {
					product.image.images.push(images[i].name);
				};
			}else{	
				//an object of one image			
				product.image.images.push(images.name);
			}			
				

			//looks like we passed the test middleware
			product.save(function(err){
				if(err) {
					console.log(err);
					return next(err);
				}

				next(null);
			});

		}else{
			//did not find a product
			next(false);
		}
	});

};


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
	//we use this function to get a single product using its id
	Product.findOne({ _id: id, t_id: tenant_id}, function(err, product){		
		next(err,product);
	});
};

exports.deleteProduct = function(id, tenant_id, next){
	//we use this to deletea the product
	Product.findOne({ _id:id, t_id: tenant_id },function(err, product){
		if(err){
			next(err);
		}else{
			product.remove();
			next(null);
		}
	});
}