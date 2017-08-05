module.exports = (sequelize, DataTypes) => {

	const StatusUpdate = sequelize.define('statusUpdate', {

		title: {
			type: DataTypes.STRING
		},

		// time when the user created the status update
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false
		}

	}, {
		classMethods: {
			associate: function(models) {
				StatusUpdate.content = StatusUpdate.belongsTo(models.content, {
					foreignKey: 'fkContentId',
					as: 'content'
				});
				StatusUpdate.changemaker = StatusUpdate.belongsTo(models.changemaker, {
					foreignKey: 'fkChangemakerId',
					as: 'changemaker'
				});
			}
		},
		freezeTableName: false // Model tableName will be the same as the model name
	});

	return StatusUpdate;
}
