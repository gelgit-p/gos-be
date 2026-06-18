const validator = require('@app-core/validator');
const { ulid } = require('@app-core/randomness');
const { CreatorCard } = require('../../models');

// Spec for createCard service
const createCardSpec = `root {
  title string
  description? string
  slug? string
  creator_reference string
  links[]? {
    title string
    url string
  }
  service_rates? {
    currency string
    rates[]? {
      name string
      description string
      amount number
    }
  }
  status string(draft|published)
  access_type? string
  access_code? string
}`;

// Parse the spec outside the service function
const parsedCreateCardSpec = validator.parse(createCardSpec);

async function createCard(serviceData) {
  const cleanedData = Object.fromEntries(
    Object.entries(serviceData).filter(([_, v]) => v !== null && v !== undefined)
  );

  const validatedData = validator.validate(cleanedData, parsedCreateCardSpec);
  // const validatedData = validator.validate(serviceData, parsedCreateCardSpec);

  const isPrivate = validatedData.access_type === 'private';
  const isPublic = validatedData.access_type === 'public';

  if (
    isPrivate &&
    (!validatedData.access_code || String(validatedData.access_code).trim().length === 0)
  ) {
    return {
      status: 'error',
      message: 'Private creator cards require an access code',
      code: 'AC01',
    };
  }

  if (
    isPublic &&
    validatedData.access_code &&
    String(validatedData.access_code).trim().length > 0
  ) {
    return {
      status: 'error',
      message: 'Public creator cards must not include an access code',
      code: 'AC05',
    };
  }

  if (validatedData.slug) {
    const existing = await CreatorCard.findOne({
      slug: validatedData.slug,
    });

    if (existing) {
      return {
        status: 'error',
        message: 'Slug is already taken',
        code: 'SL02',
      };
    }
  }

  const newId = ulid();
  const accessCode = isPublic ? undefined : validatedData.access_code || ulid().slice(0, 6);

  const cardData = {
    _id: newId,
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
