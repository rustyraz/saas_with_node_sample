var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tenant = require('../services/tenant-service');

var tenantSchema = new Schema({
	name: {type: String, required: 'Please enter a company name'},
	domain: {type: String, required: 'Domain name missing', unique: true, lowercase: true},
	created_at: {type: Date, default: Date.now}
});

var Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = {
	Tenant: Tenant
};