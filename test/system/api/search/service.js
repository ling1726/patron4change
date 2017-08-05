import config from 'config';

const search = config.get('search');
const baseUrl = 'http://' + search.host + ':' + search.port;

export { baseUrl };
