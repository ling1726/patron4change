import express from 'express';

// patron specific stuff

export default function() {

	const router = express.Router();

	router.get('/', (req,res) => {
		res.send([]);
	});

	router.get('/:username', (req,res) => {
		res.send({});
	});

	return router;
}
