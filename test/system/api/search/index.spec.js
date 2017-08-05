import baseSpec from './base.spec';
import profileSpec from './profile.spec';
import searchSpec from './search.spec';
import completionSpec from './completion.spec';

describe('Search Service', () => {

  describe('Base', baseSpec);
  describe('/profile', profileSpec);
  describe('/search', searchSpec);
  describe('/suggest', () => {
    describe('completion', completionSpec);
  });
});
