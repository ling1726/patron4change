/* This section provides tools specific to the mangopay API */
import axios from 'axios'
import paymentDAO from '../../data/paymentDAO'
import periodicBackingDAO from '../../data/periodicBackingDAO'
import singleBackingDAO from '../../data/singleBackingDAO'
import  config from 'config';

const mangopay = require('mangopay2-nodejs-sdk');
const clientId = config.get('mangopay').clientId;
const passwd = config.get('mangopay').passwd;
export default class {
	constructor(){
		this.api = new mangopay({
			clientId: clientId,
			clientPassword: passwd,
			baseUrl: config.get('mangopay').host
		});
	}
	createNaturalUser(userObject, userId){
		return this.getAccountIdForUser(userId).then((accountId) => {
			if(null !== accountId){
				throw new Error('this user already has an accountId')
			}
		}).then(() => {
			userObject.birthday = parseInt(userObject.birthday.toString().slice(0,10))
			return this.api.Users.create(userObject)
		}).then((myUser) => {
			return paymentDAO.registerChangemakerToProvider(userId, 1, myUser.Id)
		}).then((paymentAccount) => {
			return paymentAccount.accountId
		})

	}

	getAccountIdForUser(userId){
		return paymentDAO.getAccountIdForUser(userId, 1).then((accountId) => {
			if(!accountId) {
				return null;
			}
			return accountId
		})
	}

	createWallet(accountId, userId){
		return this.api.Wallets.create({
			Currency: 'EUR',
			Description: `wallet for user ${userId}`,
			Owners: [accountId]
		}).then((res) => {
			return res.Id
		})
	}

	getUserWallet(userId){
		return this.getAccountIdForUser(userId).then((accountId) => {
			if(!accountId){
				return null;
			}
			let url = `${config.get('mangopay').host}/v2.01/${clientId}/users/${accountId}/wallets`;
			return axios({
				url: url,
				method: 'get',
				auth:{
					username: clientId,
					password: passwd
				}
			}).then((res) => {
				if(!res.data.errors){
					return res.data[0].Id;
				}else{
					throw new Error('parameter problem')
				}
			}).catch((err) => {
				throw err;
			})
		})

	}

	createCardPayment(paymentData) {
		return this.getUserWallet(paymentData.changemakerId).then((walletId) =>{
			return this.api.PayIns.create({
				AuthorId: paymentData.patronAccountId,
				DebitedFunds:{
					'Currency': 'EUR',
					'Amount': paymentData.amount*100
				},
				Fees:{
					'Currency': 'EUR',
					'Amount': paymentData.patron4ChangeFees*100
				},
				ReturnUrl: `${config.get('app').host}/changemaker/${paymentData.changemakerId}/support/success`,
				CreditedWalletId: walletId,
				CardType: 'CB_VISA_MASTERCARD',
				Culture: 'DE',
				PaymentType: 'CARD',
				ExecutionType: 'WEB'
			})
		}).then((res) => {
			let backingData= {
				userId: paymentData.patronId,
				changemakerId: paymentData.changemakerId,
				amount: paymentData.amount,
				transactionDate: res.CreationDate,
				transactionId: res.Id,
				comment: paymentData.comment
			}
			let newBacking = singleBackingDAO.createSingleBacking(backingData);
			return [res.RedirectURL, newBacking];
		}).then((values) => {
			return values[0];
		}).catch((err) =>  {
			throw err;
		})

	}

	preRegisterCard(userId){
		return this.getAccountIdForUser(userId).then((accountId) => {
			let preRegistrationDatap = this.api.CardRegistrations.create({
				UserId: accountId,
				Currency: 'EUR'
			});
			let accountIdp = Promise.resolve(accountId);
			return Promise.all([accountIdp, preRegistrationDatap])
		}).then((values) => {
			let updateStatus = paymentDAO.setCardRegistrationForAccount(values[0], 1, values[1].Id);
			let RegistrationDatap = Promise.resolve(values[1])
			return Promise.all([updateStatus, RegistrationDatap])
		}).then((values) => {
			return values[1]
		})
	}

	sendTestCardData(preRegistrationData){
		// need to simulate urlencode, axios doesn't handle this!
		let querystring = require('querystring');
		let formData = {
			cardNumber: '4706750000000009',
			cardExpirationDate: '0820',
			cardCvx: '000',
			data: preRegistrationData.PreregistrationData,
			accessKeyRef: preRegistrationData.AccessKey
		};

		return axios({
			method: 'post',
			url: preRegistrationData.CardRegistrationURL,
			data: querystring.stringify(formData),
			auth:{
				username: clientId,
				password: passwd
			},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then((res) => {
				return {data: res.data, registrationId: preRegistrationData.Id}
			}).catch((err) => {
			throw err;
			})
	}

	registerCard(registrationData, registrationId){
		return this.api.CardRegistrations.update({
			RegistrationData: registrationData,
			Id: registrationId
		}).then(() => {
			return registrationId;
		})
	}

	createPeriodicBacking(paymentData){
		return periodicBackingDAO.createPeriodicBacking(paymentData)
	}

	getCardId(cardRegistrationId){
		return this.api.CardRegistrations.get(cardRegistrationId).then((res) => {
			return res.CardId;
		}).catch((err) => {
			throw err;
		})
	}

	getBulkCardIds(cardRegistrationIds){
		let allCardIdPromises = [];
		for(let i=0; i<cardRegistrationIds.length; i++){
			allCardIdPromises.push(this.getCardId(cardRegistrationIds[i]));
		}
		return allCardIdPromises;
	}

	makeMonthlyPayments(){
		let allUnpaidBackings = periodicBackingDAO.getAllUnpaidPeriodicBackings();
		for(let i=0; i<allUnpaidBackings.length; i++){
			this.makeMonthlyPayment(allUnpaidBackings[i].fkSenderId, allUnpaidBackings[i].fkRecipientId,
				allUnpaidBackings[i].amount, allUnpaidBackings[i].id	);
		}

	}

	makeMonthlyPayment(senderId, recipientId, amount, backingId){
		let senderAccountId = paymentDAO.getAccountIdForUser(senderId, 1);
		let recipientWalletId =  this.getUserWallet(recipientId);
		let senderCardId = paymentDAO.getCardRegistrationForUser(senderId, 1)
			.then((cardRegistrationId) => {
				return this.getCardId(cardRegistrationId)
			});

		return Promise.all([senderAccountId, recipientWalletId, senderCardId]).then((values) => {
			if(!senderAccountId || !recipientWalletId){
				throw new Error('one or more users do not have a payment account');
			}
			return this.makePayment(values[2], values[0], values[1], amount);
		}).then((res) => {
				return paymentDAO.createPayment(amount, res.transactionDate, res.transactionId, backingId)
		}).then(() => {
			return true;
		})

	}

	makePayment(cardId, senderAccountId, walletId, amount){
		return this.api.PayIns.create({
			AuthorId: senderAccountId,
			DebitedFunds:{
				'Currency': 'EUR',
				'Amount': amount
			},
			Fees:{
				'Currency': 'EUR',
				'Amount': 0
			},
			ReturnUrl: config.get('app').host,
			CreditedWalletId: walletId,
			CardType: 'CB_VISA_MASTERCARD',
			Culture: 'DE',
			PaymentType: 'CARD',
			ExecutionType: 'DIRECT',
			CardId: cardId,
			SecureModeReturnURL: config.get('app').host
		}).then((res) => {
			return {transactionId: res.Id, transactionDate: res.CreationDate}
		}).catch((err) => {
			throw err;
		})
	}
}
