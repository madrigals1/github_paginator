const Joi = require('@hapi/joi');

const schema = Joi.object({
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

const validate = (object) => {
    return schema.validate(object);
};

module.exports = { validate };