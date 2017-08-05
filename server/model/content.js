module.exports = (sequelize, DataTypes) => {

	const Content = sequelize.define('content', {
		text: {
			type: DataTypes.TEXT
		}
	}, {
		freezeTableName: false // Model tableName will be the same as the model name
	});

	return Content;
}
