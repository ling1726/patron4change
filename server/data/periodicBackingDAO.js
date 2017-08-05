import models from '../model/index';

export default class{

	static getAllUnpaidPeriodicBackings(){
		return  models.periodicBacking.findAll({
			include: [
			{
				model: models.backing,
				as: 'backing',
				include: [
					{
						model: models.payment,
						as: 'payments'
					}
				]
			}
			]
		}).then((periodicBackings) => {
			let unpaidBackings = [];
			let today = new Date();
			for(let i=0; i<periodicBackings.length; i++){
				let paid = false;
				for(let j=0; j<periodicBackings[i].backing.payments.length; j++){
					let paymentDate = new Date(periodicBackings[i].backing.payments[j].transactionDate);
					if(today.getMonth() === paymentDate.getMonth() && today.getYear() === paymentDate.getYear()){
						paid = true;
					}
				}
				if(!paid){
					unpaidBackings.push(periodicBackings[i]);
				}
			}

			return unpaidBackings;
		});
	}

	static createPeriodicBacking(paymentData){
		let changemakerPromise = models.user.findById(paymentData.changemakerId);
		let patronPromise = models.user.findById(paymentData.patronId)

		return Promise.all([changemakerPromise, patronPromise]).then(values => {
			if(!values[0]){
				throw new Error(`changemaker ${paymentData.changemakerId} does not exist`);
			}
			if(!values[1]){
				throw new Error(`user ${paymentData.userId} does not exist`)
			}

			if(paymentData.patronId === paymentData.changemakerId){
				throw new Error('a changemaker cannot back himself!')
			}

			if(isNaN(paymentData.amount)){
				throw new Error('not a valid amount');
			}

			if(isNaN(paymentData.startDate)){
				throw new Error('not a valid timestamp, UNIX timestamp only please')
			}
			let backing = models.periodicBacking.create({
			startDate:paymentData.startDate,
			backing: {
				amount: paymentData.amount,
				fkSenderId: paymentData.patronId,
				fkRecipientId: paymentData.changemakerId
			}
		},{
				include: [{
					model: models.backing, as: 'backing'
				}]
			});

		return backing
		})
	}
}

