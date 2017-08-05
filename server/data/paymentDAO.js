/**
 * Created by ling on 08.12.16.
 */
import models from '../model/index';

export default class{

	static registerChangemakerToProvider(changemakerId, providerId, accountId) {
		let changemakerPromise = models.user.findById(changemakerId);
		let providerPromise = models.paymentProvider.findById(providerId);

		return Promise.all([changemakerPromise, providerPromise]).then(values => {
				if(!values[0]){
					throw new Error(`changemaker ${changemakerId} does not exist`);
				}
				if(!values[1]){
					throw new Error(`provider ${providerId} does not exist`);
				}

				let pp = models.paymentServiceData.create({
					accountId: accountId,
					fkUserId: changemakerId,
					fkPaymentProviderId: providerId
				}).then((paymentServiceData) => {
					return paymentServiceData;
				}).catch((err) => {
					throw err;
				});

				return pp;

			})
	}

	static createPayment(amount, transactionDate, transactionId, backingId){
		return models.payment.create({
			amount: amount,
			transactionDate: transactionDate,
			transactionId: transactionId,
			currency: 'EUR',
			fkBackingId: backingId
		});
	}

	static createSingleBacking(patronId, changemakerId, transactionId, amount, comment, transactionDate){
		let changemakerPromise = models.user.findById(changemakerId);
		let patronPromise = models.user.findById(patronId);

		return Promise.all([changemakerPromise, patronPromise]).then(values => {
			if(!values[0]){
				throw new Error(`user ${changemakerId} does not exist`);
			}
			if(!values[1]){
				throw new Error(`user ${patronId} does not exist`)
			}

			if(patronId === changemakerId){
				throw new Error('a changemaker cannot back himself!')
			}

			if(isNaN(amount)){
				throw new Error('not a valid amount');
			}

			if(isNaN(transactionDate)){
				throw new Error('not a valid timestamp, UNIX timestamp only please')
			}
			let backing = models.singleBacking.create({
			backing: {
				amount: amount,
				comment: comment,
				fkSenderId: patronId,
				fkRecipientId: changemakerId,
				payments: [{
					amount: amount,
					transactionDate: transactionDate,
					transactionId: transactionId
				}]
			}
		},{
				include: [{
					model: models.backing, as: 'backing',
					include: [{model: models.payment, as: 'payments'}]
				}]
			});

		return backing
		})
	}

	static getAccountIdForUser(userId, paymentProviderId){
		return models.paymentServiceData.findOne({where: {fkUserId: userId, fkPaymentProviderId: paymentProviderId}})
			.then((res) => {
				if (!res) {
					return null;
				}
				return res.accountId;
			})
	}

	static getCardRegistrationForUser(userId, paymentProviderId){
		return models.paymentServiceData.findOne({where: {fkUserId: userId, fkPaymentProviderId: paymentProviderId}})
			.then((res) =>{
				return res.cardRegistrationId;
			})
	}

	static setCardRegistrationForAccount(accountId, paymentProviderId, cardRegistrationData){
		return models.paymentServiceData.findOne({where: {accountId: accountId, fkPaymentProviderId: paymentProviderId}})
			.then((res) => {
			if(null === res){
						throw new Error('no account has been found for ' + accountId)
			}
			res.cardRegistrationId = cardRegistrationData;
			return res.save()
			}).then(() => {
				return true;
			})
	}

	static getCardRegistrationForAccount(accountId, paymentProviderId){
		return models.paymentServiceData.findOne({where:{accountId: accountId, fkPaymentProviderId: paymentProviderId}})
			.then((res) => {
				return res.cardRegistrationId;
			})
	}

}
