'use strict';

const Joi = require('@hapi/joi');

/**
 * Schema used for validation of Asset class in asset/model.js
 *
 * @param {number} id
 * @param {string} title
 * @param {number} level - hierarchical level of the Asset
 * @param {number[]} children - children of the Asset, by default should be empty
 * @param {number} parent_id - id of the parent Asset, can be null to represent
 * top level Asset
 */
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