'use strict';

const {validate} = require('./schema');

/**
 * Represents the object, loaded from JSON. Can be anything that has children and/or parent.
 * Params get validated before assigning to object, ensuring invalid data will throw HTTP error
 *
 * @constructor
 * @param = {Object} params - Object with the list of params, provided in asset/schema.js
 */
class Asset {
    constructor(params) {
        const {error, value: validParams} = validate(params);
        if (error)
            this.error = error;
        else
            Object.assign(this, validParams);
    }
}

module.exports = {Asset};