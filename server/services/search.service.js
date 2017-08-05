import axios from 'axios';
import { ValidationError } from './error';

function getHighlightSection(hit) {
  let { highlight } = hit;
  if (!highlight) {
    return null;
  }
  if (highlight.mission && 0 < highlight.mission.length) {
    return {
      type: 'mission',
      value: highlight.mission[0]
    }
  }
  return null;
}

export default class {

  constructor(config, dao) {
    this.searchApiUrl = `http://${config.host}:${config.port}/`;
    this.dao = dao;
  }

  search(term) {

    if (!term) {
      throw new ValidationError('term required');
    }

    return axios(`${this.searchApiUrl}search/changemaker?q=${term}`).then(searchRes => {
      const changemakers = searchRes.data.map(hit => this.dao.getUserForId(hit._id));
      return Promise.all(changemakers).then(cms => {
        let idx = cms.filter(c => !!c).reduce((ctx, next) => {
          ctx[next.id] = next;
          return ctx;
        }, {});
        return searchRes.data.map(hit => ({
          match: {
            relevance: hit._score,
            section: getHighlightSection(hit)
          },
          changemaker: idx[hit._id]
        }));
      });
    });
  }
}
