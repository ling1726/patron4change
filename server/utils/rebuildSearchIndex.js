import model from '../model';
import queue from './queue';

// TODO also consider status updates

export default function () {
  return model.changemaker.findAll({
    include: [
      { model: model.user, as: 'user' },
      { model: model.content, as: 'mission' }
    ]
  })
  .then(changemakers => {
    changemakers.map(changemaker => {
      // Push to queue so the update worker will take care of it.
      // If there are more than 1000 changemakers in the DB, consider sending them
      // directly to the service without using the queue.
      queue('updateSearchIndex').push(changemaker.get({ plain: true }));
    });
  });
}
