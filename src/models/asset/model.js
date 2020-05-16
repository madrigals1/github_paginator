'use strict';

const {validate} = require('./schema');

class Asset {
    constructor(params) {
        const validation = validate(params);
        const {error, value: validParams} = validation;
        if (error) {
            this.error = error;
        } else {
            Object.assign(this, validParams);
        }
    }
}

module.exports = {Asset};