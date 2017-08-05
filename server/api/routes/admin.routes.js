import express from 'express';

// routes for administrative stuff

export default () => {

	const router = express.Router();

	router.get('/', (req,res) => {
		res.send([]);
	});

	router.get('/:username', (req,res) => {
		res.send({});
	});

	return router;
}
