const assert = require('assert');

const { CreatorCard } = require('../../models');
const createCard = require('./create-card');

describe('services/creator-card/create-card', () => {
  const originalFindOne = CreatorCard.findOne;
  const originalCreate = CreatorCard.create;

  afterEach(() => {
    CreatorCard.findOne = originalFindOne;
    CreatorCard.create = originalCreate;
  });

  it('should return SL02 when slug already exists', async () => {
    CreatorCard.findOne = async ({ slug }) => {
      if (slug === 'george-cooks') {
        return { slug: 'george-cooks', creator_reference: 'crt_m1n2b3v4c5x6z7l8' };
      }
      return null;
    };

    CreatorCard.create = async () => {
      throw new Error('create should not be called when slug already exists');
    };

    const result = await createCard({
      title: 'Another George',
      slug: 'george-cooks',
      creator_reference: 'crt_m1n2b3v4c5x6z7l8',
      status: 'published',
    });

    assert.strictEqual(result.status, 'error');
    assert.strictEqual(result.code, 'SL02');
    assert.strictEqual(result.message, 'Slug is already taken');
  });

  it('should return AC05 when public card includes an access code', async () => {
    CreatorCard.findOne = async () => null;
    CreatorCard.create = async () => {
      throw new Error('create should not be called when validation fails');
    };

    const result = await createCard({
      title: 'Public Card',
      creator_reference: 'crt_q1w2e3r4t5y6u7i8',
      status: 'published',
      access_type: 'public',
      access_code: 'A1B2C3',
    });

    assert.strictEqual(result.status, 'error');
    assert.strictEqual(result.code, 'AC05');
    assert.strictEqual(result.message, 'Public creator cards must not include an access code');
  });
});
