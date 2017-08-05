import elasticsearch from 'elasticsearch';
import config from 'config';

const client = new elasticsearch.Client(config.get('elasticsearch'));

export default client;
