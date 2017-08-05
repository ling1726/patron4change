module.exports = (sequelize, DataTypes) => {

	const Backing = sequelize.define('backing', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
					isInt: true
			}
		},
		comment: {
			type: DataTypes.STRING,
			validate: {
				len: [1, 100]
			}
		}
	}, {
		classMethods:{
			associate: function(models){
				Backing.belongsTo(models.user, {foreignKey: 'fkSenderId', as: 'user'});
				Backing.belongsTo(models.changemaker, {foreignKey: 'fkRecipientId', as: 'changemaker'});
				Backing.hasMany(models.payment, {foreignKey: 'fkBackingId', as: 'payments'})
			}
		},

		freezeTableName: false // Model tableName will be the same as the model name
	});

	return Backing;
}
