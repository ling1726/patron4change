/* eslint no-console: 0 */

function testInsert(models, logging) {
	return models.content.bulkCreate(require('../../../mock/content.json'), { logging })
		.then(() => {
			return models.user.bulkCreate(require('../../../mock/users.json'), { logging });
		})
		.then(() => {
			return models.changemaker.bulkCreate(require('../../../mock/changemakers.json'), { logging });
		})
		.then(() => {
			return models.statusUpdate.bulkCreate(require('../../../mock/status_update.json'), { logging });
		})
		.then(() => {
			return models.paymentProvider.bulkCreate(require('../../../mock/paymentProviders.json'), { logging });
		})
		.then(() => {
			return models.backing.bulkCreate(require('../../../mock/backings.json'), { logging });
		})
		.then(() => {
			return models.periodicBacking.bulkCreate(require('../../../mock/periodic_backings.json'), { logging })
		})
		.then(() => {
			return models.paymentServiceData.bulkCreate(require('../../../mock/paymentServiceData.json'), { logging })
		})
		.then(() => {
			return models.payment.bulkCreate(require('../../../mock/payments.json'), { logging })
		})
		.catch((err) => {
			console.error(err);
		});
}

module.exports = { testInsert };
