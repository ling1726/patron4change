import {after} from 'mocha';
import {before} from 'mocha';

before(function() {
	process.env.NODE_ENV = 'test';
});

after(function() {
	process.env.NODE_ENV = '';
});
