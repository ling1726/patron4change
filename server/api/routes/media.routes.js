import express from 'express';
import fileUpload from 'express-fileupload';

export default (mediaService) => {

  const router = express.Router();

  router.use(fileUpload());

  router.post('/', (req, res) => {
    if (!req.files || !req.files.file) {
      res.status(400).send('No files were uploaded');
      return;
    }
    const type = req.query.type;
    if (!type) {
      res.status(400).send('Type must be specified');
      return;
    }
    mediaService.upload(req.files.file.data, type).then(objectName => {
      res.send(objectName);
    });
  });

  router.post('/encodingDone', (req, res) => {
    const objectName = req.query.objectName;
    if (!objectName) {
      res.sendStatus(400);
      return;
    }
    mediaService.encodingDone(objectName, req.body);
    res.sendStatus(202);
  });

  return router;
};
