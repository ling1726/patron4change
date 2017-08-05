import queue from '../utils/queue';

module.exports = (sequelize, DataTypes) => {

	const Changemaker = sequelize.define('changemaker', {
		isApproved: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		// exact date when the changemaker was approved by the platform moderators
		approvalDate: {
			type: DataTypes.DATE
		},
		videoUrl: {
			type: DataTypes.STRING
		}
	}, {
		classMethods: {
			associate: function(models){
				Changemaker.belongsTo(models.user, {foreignKey: 'fkUserId', as: 'user'});
				Changemaker.mission = Changemaker.belongsTo(models.content, {foreignKey: 'fkContentId', as: 'mission'});
				Changemaker.hasMany(models.statusUpdate, {as: 'statusUpdates', foreignKey: 'fkChangemakerId'});
				Changemaker.hasMany(models.backing, {as: 'backings', foreignKey: 'fkRecipientId'})
			}
		},

		freezeTableName: false // Model tableName will be the same as the model name
	}, {
		defaultScope: {
			where: {
				isApproved: true
			}
		},
		unapproved: {
			where: {
				isApproved: false
			}
		}
	});

	const pushUpdate = function (instance) {
		const updateQueue = queue('updateSearchIndex');
		if (updateQueue) {
			updateQueue.push(instance.get({ plain: true }));
		}
	};

	Changemaker.hook('afterCreate', pushUpdate);
	Changemaker.hook('afterUpdate', pushUpdate);

	return Changemaker;
}
