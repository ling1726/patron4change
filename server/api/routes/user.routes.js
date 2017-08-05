import express from 'express';
import controller from './controller'

// routers for every user, doesnt matter if admin, patron, changemaker

export default (userSvc) => {

	const router = express.Router();

	router.get('/:id', (req,res) => {
		userSvc.getUserForId(req.params.id).then(user => {
			res.send(user);
		}).catch(() => {
			res.status(400).send('general operation error');
		});
	});

	router.post('/login', (req,res) => {
		userSvc.loginUser(req.body.email).then((user) => {
			res.send(user)
		}).catch(() => {
			res.status(400).send('general operation error');
		})
	})


	router.put('/update', (req, res) => {
		userSvc.updateUser(req.body).then((user) => {
			res.send(user)
		}).catch(() => {
			res.status(400).send('general operation error');
		})
	})

	router.post('/checkCard', controller((data) => {
		return userSvc.checkUserHasRegisteredCard(data.model);
	}));


	router.post('/checkCard', )

	return router;
}
