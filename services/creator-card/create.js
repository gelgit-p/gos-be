const validator = require('@app-core/validator');
const { ulid } = require('@app-core/randomness');
const { CreatorCard } = require('../../models');
// const { throwAppError } = require('@app-core/errors');

// Spec for createCard service
const createCardSpec = `root {
  title string
  description string?
  slug string?
  creator_reference string
  links[]? {
    title string
    url string
  }
  service_rates? {
    currency string
    rates[] {
      name string
      description string
      amount number
    }
  }
  status string
  access_type string?
}`;

// Parse the spec outside the service function
const parsedCreateCardSpec = validator.parse(createCardSpec);

async function createCard(serviceData) {
  const validatedData = validator.validate(serviceData, parsedCreateCardSpec);

  const slug = typeof validatedData.slug === 'string' ? validatedData.slug.trim() : '';
  const hasSlug = slug.length > 0;

  if (hasSlug) {
    const existing = await CreatorCard.findOne({ slug });

    if (existing) {
      return {
        status: 'error',
        message: 'Slug is already taken',
        code: 'SL02',
      };
    }

    validatedData.slug = slug;
  } else {
    delete validatedData.slug;
  }

  const newId = ulid();
  const isPublic = validatedData.access_type === 'public';
  const accessCode = isPublic ? undefined : ulid().slice(0, 6);

  const cardData = {
    _id: newId,
    id: newId,
    ...validatedData,
    ...(!isPublic ? { access_code: accessCode } : {}),
    created: Date.now(),
    updated: Date.now(),
    deleted: 0,
  };

  const card = await CreatorCard.create(cardData);

  const response = card.toObject();

  response.id = response._id;
  delete response._id;

  if (response.access_type === 'public') {
    delete response.access_code;
  }

  return response;
}

module.exports = createCard;
