require('babel-register');
const models = require('./server/model');
const testInsert = require('./test/integration/dao/testInsert');

models.sequelize.sync({'force': true})
  .then(() => testInsert.testInsert(models, false));
