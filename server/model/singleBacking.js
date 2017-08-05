module.exports = (sequelize) => {

	const singleBacking = sequelize.define('singleBacking', {
	}, {
		classMethods:{
			associate: function(models){
				singleBacking.belongsTo(models.backing, {foreignKey: 'fkBackingId', as: 'backing'});
			}
		},

		freezeTableName: false // Model tableName will be the same as the model name
	});

	return singleBacking;
};
