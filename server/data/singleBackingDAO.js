/**
 * Created by ling on 08.12.16.
 */
import models from '../model/index';

export default class {

	static createSingleBacking(backingData) {
		let changemakerPromise = models.changemaker.findById(backingData.changemakerId);
		let patronPromise = models.user.findById(backingData.userId)

		return Promise.all([changemakerPromise, patronPromise]).then(values => {
		if(!values[0]){
			throw new Error(`changemaker ${backingData.changemakerId} does not exist`);
		}
		if (!values[1]) {
			throw new Error(`user ${backingData.userId} does not exist`)
		}

		if (backingData.userId === backingData.changemakerId) {
			throw new Error('a changemaker cannot back himself!')
		}

		if (isNaN(backingData.amount)) {
			throw new Error('not a valid amount');
		}

		if (isNaN(backingData.transactionDate)) {
			throw new Error('not a valid timestamp, UNIX timestamp only please')
		}
		let backing = models.singleBacking.create({
			backing: {
				amount: backingData.amount,
				fkSenderId: backingData.userId,
				fkRecipientId: backingData.changemakerId,
				payments: [{
					amount: backingData.amount,
					transactionDate: backingData.transactionDate,
					transactionId: backingData.transactionId
				}]
			}
		}, {
			include: [{
				model: models.backing, as: 'backing',
				include: [{model: models.payment, as: 'payments'}]
			}]
		});
		return backing
	})


	}
}
