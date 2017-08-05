import express from 'express';

// routers for every user, doesnt matter if admin, patron, changemaker

export default (countrySvc) => {

	const router = express.Router();

	router.get('/all', (req,res) => {
		countrySvc.getCountries().then(countries => {
			res.send(countries);
		});
	});


	return router;
}
