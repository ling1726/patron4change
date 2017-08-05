import axios from 'axios';
import config from 'config';

const searchConfig = config.get('search');
const service = axios.create({
  baseURL: 'http://' + searchConfig.host + ':' + searchConfig.port
});

module.exports = (batch, cb) => {
  service.post('/profile/changemaker/', batch)
  .then(() => {
    cb();
  })
  .catch(cb);
}
