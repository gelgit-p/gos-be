const { ModelSchema, SchemaTypes, DatabaseModel } = require('@app-core/mongoose');

const modelName = 'creator_card';

/**
 * @typedef {Object} ModelSchema
 * @property {String} _id
 * @property {Object} title
 * @property {Object} description
 * @property {String} slug
 * @property {String} creator_reference
 * @property {Array} links
 * @property {Array} service_rates
 * @property {String} status
 * @property {String} access_type
 * @property {String} access_code
 * @property {String} created
 * @property {String} updated
 * @property {String} deleted
 */

const schemaConfig = {
  _id: { type: SchemaTypes.ULID, required: true },
  title: { type: SchemaTypes.String, required: true },
  description: { type: SchemaTypes.String, required: false },
  slug: { type: SchemaTypes.String, required: false },
  creator_reference: { type: SchemaTypes.String, required: true },
  links: { type: SchemaTypes.Array, required: false },
  service_rates: { type: SchemaTypes.Array, required: false },
  status: { type: SchemaTypes.String, required: true },
  access_type: { type: SchemaTypes.String, required: false },
  access_code: { type: SchemaTypes.String, required: false },
  created: { type: SchemaTypes.Number, required: true },
  updated: { type: SchemaTypes.Number, required: true },
  deleted: { type: SchemaTypes.Number, required: true },
};

const modelSchema = new ModelSchema(schemaConfig, { collection: modelName });

/** @type {ModelSchema} */
module.exports = DatabaseModel.model(modelName, modelSchema);
