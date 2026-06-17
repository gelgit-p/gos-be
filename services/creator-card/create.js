const validator = require('@app-core/validator');
const { ulid } = require('@app-core/randomness');
const { CreatorCard } = require('../../models');
// const { throwAppError } = require('@app-core/errors');

// Spec for createCard service
const createCardSpec = `root {
  title string
  description string
  slug string
  creator_reference string
  links[] {
    title string
    url string
  }
  service_rates {
    currency string
    rates[] {
      name string
      description string
      amount number
    }
  }
  status string
  access_type string
}`;

// Parse the spec outside the service function
const parsedCreateCardSpec = validator.parse(createCardSpec);

async function createCard(serviceData) {
  const validatedData = validator.validate(serviceData, parsedCreateCardSpec);

  // check slug uniqueness first
  const existing = await CreatorCard.findOne({ slug: validatedData.slug });

  if (existing) {
    return {
      status: 'error',
      message: 'Slug is already taken',
      code: 'SL02',
    };
  }

  const newId = ulid();

  const accessCode = ulid().slice(0, 6);

  const cardData = {
    _id: newId,
    id: newId,
    ...validatedData,
    access_code: accessCode,
    created: Date.now(),
    updated: Date.now(),
    deleted: 0,
  };

  const card = await CreatorCard.create(cardData);

  const response = card.toObject();

  response.id = response._id;
  delete response._id;

  return response;
}

module.exports = createCard;
