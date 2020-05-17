const Joi = require('@hapi/joi');

/**
 * Schema used for validation of HapiServer class params in server/model.js
 *
 * @param {string} name - only used to display in logs
 * @param {number} port - should set unused port in your Device
 * @param {string} host - domain of Server, can use localhost for your PC
 * @param {boolean} logs - if on, Server will show logs
 */
const schema = Joi.object({
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

    logs: Joi.boolean()
        .default(true),
});

/**
 * Validation of given object using schema provided above
 *
 * @param {Object} params - object that needs to be validated
 * @returns {Object} validated object
 */
const validate = (params) => {
    return schema.validate(params);
};

module.exports = {validate};