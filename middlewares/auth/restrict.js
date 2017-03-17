module.exports = function(req, res, next){
	//this will be used as a middleware for checking the user authentication for certain routes
	if(req.isAuthenticated()){
		return next();
	}
	
	
	if(req.originalUrl.indexOf('admin') === -1){
		res.redirect('/');
	}else{
		res.redirect('/admin/login');
	}
	
};