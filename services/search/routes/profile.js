import express from 'express';
import elastic from '../elastic';

const router = express.Router();
export default router;

const index = 'profile';

function prepareDocument(changemaker) {
  const doc = {
    firstName: changemaker.user ? changemaker.user.firstName : '',
    lastName: changemaker.user ? changemaker.user.lastName : '',
    tags: changemaker.tags || [],
    mission: changemaker.mission ? changemaker.mission.text : '',
    statusUpdates: changemaker.statusUpdates ? changemaker.statusUpdates.map(update => {
      return {
        title: update.title,
        content: update.content ? update.content.text : ''
      };
    }) : []
  };
  doc.suggest = [doc.tags, doc.firstName, doc.lastName];
  doc.suggest = doc.suggest.join(' ');
  return doc;
}

router.put('/:type/:id', (req, res) => {
  elastic.index({
    index: index,
    type: req.params.type,
    id: req.params.id,
    body: prepareDocument(req.body)
  })
  .then((result) => {
    res.status(200).send(result);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

router.delete('/:type/:id', (req, res) => {
  elastic.delete({
    index: index,
    type: req.params.type,
    id: req.params.id
  })
  .then((result) => {
    res.status(200).send(result);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

// Bulk update/insert
router.post('/:type', (req, res) => {
  const body = [];
  req.body.forEach(profile => {
    // Bulk API requires metadata before each document
    body.push({ index: { _index: index, _type: req.params.type, _id: profile.id} });
    body.push(prepareDocument(profile));
  });

  elastic.bulk({
    body: body
  });
  // TODO logging

  res.sendStatus(202);
});
