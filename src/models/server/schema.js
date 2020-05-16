const Joi = require('@hapi/joi');

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

const validate = (params) => {
    return schema.validate(params);
};

module.exports = { validate };