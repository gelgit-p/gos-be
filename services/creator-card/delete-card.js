const validator = require('@app-core/validator');
const { CreatorCard } = require('../../models');

const deleteCreatorCardSpec = `root {
  creator_reference string<length:20>
}`;

const parsedDeleteCreatorCardSpec = validator.parse(deleteCreatorCardSpec);

async function deleteCard({ slug, creatorReference }) {
  const validatedData = validator.validate({ creatorReference }, parsedDeleteCreatorCardSpec);

  const card = await CreatorCard.findOne({ slug, deleted: 0 });

  if (!card) {
    return {
      status: 'error',
      statusCode: 404,
      message: 'Creator card not found',
      code: 'NF01',
    };
  }

  if (card.creator_reference !== validatedData.creatorReference) {
    return {
      status: 'error',
      statusCode: 403,
      message: 'Unauthorized to delete creator card',
      code: 'AC03',
    };
  }

  card.deleted = Date.now();
  card.updated = Date.now();

  await card.save();

  const response = card.toObject();
  response.id = response._id;
  delete response._id;
  response.access_code = null;

  return response;
}

module.exports = deleteCard;
