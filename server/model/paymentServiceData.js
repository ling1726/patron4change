export default (sequelize, DataTypes) =>{

	const paymentServiceData = sequelize.define('paymentServiceData', {
		accountId: {
			type: DataTypes.STRING
		},
		cardRegistrationId:{
			type: DataTypes.STRING
		}
	}, {
		freezeTableName: false // Model tableName will be the same as the model name
	});

	return paymentServiceData;
};
