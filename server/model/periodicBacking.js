module.exports = (sequelize, DataTypes) => {

	const Backing = sequelize.define('periodicBacking', {
		startDate: {
			type: DataTypes.DATE
		},
		endDate: {
			type: DataTypes.DATE
		}
	}, {
		classMethods:{
			associate: function(models){
				Backing.belongsTo(models.backing, {foreignKey: 'fkBackingId', as: 'backing'});
			}
		},

		freezeTableName: false // Model tableName will be the same as the model name
	});

	return Backing;
}
