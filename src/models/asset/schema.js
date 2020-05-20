'use strict';

const Joi = require('@hapi/joi');

/**
 * Schema used for validation of Asset class
 * @type {Asset}
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

/**
 * Validation of given object using AssetSchema
 *
 * @method
 * @param {object} params - object that needs to be validated
 * @returns {object} validated object
 */
const validateAsset = (params) => {
    return AssetSchema.validate(params);
};

module.exports = {validateAsset};