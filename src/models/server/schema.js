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

module.exports = HapiServerSchema;
