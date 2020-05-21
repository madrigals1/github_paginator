const Joi = require('@hapi/joi');

/**
 * Schema used for validation of Asset class
 * @type {Joi.object}
 * @property {object} params - params of Asset Joi.object.
 * @property {number} params.id - id of the Asset. Value is minimum 0.
 * @property {string} params.title - name of the Asset. Length is minimum 1 symbols.
 * @property {number} params.level - hierarchical level of the Asset. Value is minimum 0.
 * @property {number[]} params.children - ids of children of the Asset. Must be empty.
 * @property {number} params.parent_id - parent_id of the Asset. Can be null.
 */
const AssetSchema = Joi.object({
  id: Joi.number()
    .integer()
    .min(0)
    .required(),

  title: Joi.string()
    .min(1)
    .required(),

  level: Joi.number()
    .integer()
    .min(0)
    .required(),

  children: Joi
    .array()
    .max(0),

  parent_id: Joi
    .number()
    .allow(null)
    .required(),
});

module.exports = AssetSchema;
