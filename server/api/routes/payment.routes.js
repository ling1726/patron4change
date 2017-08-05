import express from 'express';
import controller from './controller';

export default (paymentSvcs) => {

  const router = express.Router();

  router.post('/mango/register', (req, res) => {
		paymentSvcs.mango.registerUser(req.body).then((accountId) => {
			res.send(accountId)
		}).catch(() => {
			res.status(400).send('general operation error');
		})
	});

  router.post('/mango/pay', (req, res) => {
  	paymentSvcs.mango.oneTimeSupport(req.body).then((url) => {
  		res.send(url)
		}).catch(() => {
  		res.status(400).send('general operation error');
		})
	});

	router.post('/mango/preregisterCard', controller((data) => {
		return paymentSvcs.mango.prepareToReadCardDetails(data.model);
	}));

	router.post('/mango/registerCard', (req, res) => {
		paymentSvcs.mango.registerCreditCardForRecurringPayment(req.body)
			.then((cardRegistrationId) => {
				res.send(cardRegistrationId);
			}).catch(() => {
				res.status(400).send('general operation error')
			})
	});

	router.post('/mango/recurring', controller((data) => {
		return paymentSvcs.mango.createRecurringPayment(data.model);
	}));

  return router;
}
