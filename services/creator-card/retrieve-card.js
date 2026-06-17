const { CreatorCard } = require('../../models');

async function retrieveCard({ slug, accessCode }) {
  const card = await CreatorCard.findOne({ slug }).lean();

  if (!card) {
    return {
      status: 'error',
      statusCode: 404,
      message: 'Creator card not found',
      code: 'NF01',
    };
  }

  if (card.status === 'draft') {
    return {
      status: 'error',
      statusCode: 404,
      message: 'Creator card is unavailable',
      code: 'NF02',
    };
  }

  if (card.access_type === 'private') {
    if (!accessCode) {
      return {
        status: 'error',
        statusCode: 403,
        message: 'This card is private. An access code is required',
        code: 'AC03',
      };
    }

    if (accessCode !== card.access_code) {
      return {
        status: 'error',
        statusCode: 403,
        message: 'Invalid access code',
        code: 'AC045',
      };
    }
  }

  const cardResponse = {
    ...card,
    id: card._id,
  };

  delete cardResponse._id;
  delete cardResponse.access_code;

  return cardResponse;
}

module.exports = retrieveCard;
