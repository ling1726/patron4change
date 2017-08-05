
export default (sequelize) => {


	const ContentFlag = sequelize.define('contentFlag', {},
		{
		classMethods: {
			associate: function(models){
				ContentFlag.belongsTo(models.user, {foreignKey: 'fkReporterId', as: 'user'});
				ContentFlag.belongsTo(models.content, {foreignKey: 'fkReportedContentId', as: 'content'});
			}
		}
	}, {
		freezeTableName: false // Model tableName will be the same as the model name
	});

	return ContentFlag;
}
