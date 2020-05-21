const Joi = require('@hapi/joi');

/**
 * Schema used for validation of HapiServer class
 * @type {Joi.object}
 * @property {object} params - params of HapiServer Joi.object.
 * @property {string} [params.name=Hapi Server] - name of the HapiServer. Length is between 1 and 30
 * symbols, default value is "Hapi Server".
 * @property {number} [params.port=3000] - port of the HapiServer. Value is between 0 and 65535,
 * default value is 3000.
 * @property {string} [params.host=localhost] - domain of the HapiServer.
 * @property {boolean} [params.canShowLogs=true] - if on, server will show logs.
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
    .default(3000),

  host: Joi.string()
    .allow(null)
    .empty(null)
    .default('localhost'),

  canShowLogs: Joi.boolean()
    .default(true),
});

module.exports = HapiServerSchema;
