import express from 'express';

import changemakerRoutes from'./changemaker.routes';
import adminRoutes from'./admin.routes';
import patronRoutes from'./patron.routes';
import userRoutes from'./user.routes';
import searchRoutes from'./search.routes';
import paymentRoutes from './payment.routes'
import mediaRoutes from './media.routes';
import countryRoutes from './country.routes'

import changemakerDao from '../../data/changemakerDAO';
import userDAO from '../../data/userDAO';
import statusUpdateDAO from '../../data/statusUpdateDAO';
import backingDAO from '../../data/backingDAO';
import countryDAO from '../../data/countryDAO'

import ChangemakerService from '../../services/changemaker.service.js';
import PatronService from '../../services/patron.service.js';
import UsersService from '../../services/users.service.js';
import SearchService from '../../services/search.service.js';
import mangoService from '../../services/payments/mango.js';
import MediaService from '../../services/media.service.js';
import CountryService from '../../services/country.service.js'

import config from 'config';
const searchConfig = config.get('search');
const storageConfig = config.get('storage');
const coconutConfig = config.get('coconut');

const router = express.Router();

router.get('/', (req, res) => {
	res.sendStatus(204);
});

const paymentsvcs = {mango: new mangoService()};

router.use('/changemakers', changemakerRoutes(new ChangemakerService(changemakerDao, backingDAO, statusUpdateDAO)));
router.use('/users', userRoutes(new UsersService(userDAO)));
router.use('/patrons', patronRoutes(new PatronService(userDAO)));
router.use('/admins', adminRoutes(new UsersService(userDAO)));
router.use('/search', searchRoutes(new SearchService(searchConfig, userDAO)));
router.use('/payment', paymentRoutes(paymentsvcs));
router.use('/media', mediaRoutes(new MediaService(storageConfig, coconutConfig)));
router.use('/country', countryRoutes(new CountryService(countryDAO)));

export default router;
