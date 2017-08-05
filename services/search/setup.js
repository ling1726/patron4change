import elastic from './elastic';

export default () => {
  const alias = 'profile';
  const localIndex = require('./indices/profile.json');
  const newIndexVersion = Object.keys(localIndex)[0];
  let oldIndexVersion;

  return elastic.indices.existsAlias({
    name: alias
  })
  .then(exists => {
    // Get the alias if it exists
    if (exists) {
      return elastic.indices.getAlias({
        name: alias
      });
    } else {
      return Promise.resolve(null);
    }
  })
  .then(idxAlias => {
    // Check if the alias points to the current version
    // Create index if it is outdated or doesn't exist
    let createIndex = false;
    if (idxAlias) {
      oldIndexVersion = Object.keys(idxAlias)[0];
      createIndex = oldIndexVersion !== newIndexVersion;
    } else {
      createIndex = true;
    }
    if (createIndex) {
      return elastic.indices.create({
        index: newIndexVersion,
        body: localIndex[newIndexVersion]
      });
    } else {
      return Promise.resolve(null);
    }
  })
  .then(createdIndex => {
    // Start reindexing if necessary
    if (createdIndex && oldIndexVersion) {
      return elastic.reindex({
        waitForCompletion: true,
        body: {
          source: { index: oldIndexVersion },
          dest: { index: newIndexVersion }
        }
      });
    } else {
      return Promise.resolve(null);
    }
  })
  .then(reindexed => {
    // Swap alias atomically if reindexing was successful
    // Create alias if it didn't exist before
    if (reindexed) {
      return elastic.indices.updateAliases({
        body: {
          actions: [
            { remove: { index: oldIndexVersion, alias: alias } },
            { add: { index: newIndexVersion, alias: alias } }
          ]
        }
      });
    } else if (!oldIndexVersion) {
      return elastic.indices.putAlias({
        index: newIndexVersion,
        name: alias
      });
    } else {
      return Promise.resolve(null);
    }
  })
  .then(() => {
    // Remove old index if a new index was installed
    if (!!oldIndexVersion && oldIndexVersion !== newIndexVersion) {
      return elastic.indices.delete({
        index: oldIndexVersion
      });
    } else {
      return Promise.resolve(null);
    }
  });
};
