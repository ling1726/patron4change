/* eslint no-sync: 0, no-console: 0 */
// no-console: until silly-logger is applied
// no-sync: easier to initialize models
const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const config    = require('config');

const sequelize = new Sequelize(
	config.get('database').database,
	config.get('database').user,
	config.get('database').password,
{
		host: config.get('database').host,
		port: config.get('database').port,
		dialect: 'postgres',
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		},
		// TODO apply winston silly logger
		logging: config.get('dblog') ? console.log : false
});

const db = {};

fs
	.readdirSync(__dirname)
	.filter(function(file) {
		return 0 !== file.indexOf('.') && 'index.js' !== file;
	})
	.forEach(function(file) {
		const model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(function(modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
