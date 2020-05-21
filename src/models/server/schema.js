const Joi = require('@hapi/joi');

/**
 * Schema used for validation of HapiServer class
 * @type {HapiServer}
 */
const HapiServerSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(30)
    .default('Hapi Server'),

  port: Joi.number()
    .integer()
    .min(0)
    .max(65535)
    .default(3000)
    .required(),

  host: Joi.string()
    .allow(null)
    .empty(null)
    .default('localhost'),

  canShowLogs: Joi.boolean()
    .default(true),
});

/**
 * @desc Validation of given object using HapiServerSchema
 *
 * @method
 * @param {object} params - object that needs to be validated
 * @returns {object} validated object or object with error
 */
const validateHapiServer = (params) => HapiServerSchema.validate(params);

module.exports = { validateHapiServer };
