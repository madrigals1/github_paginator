'use strict';

const {validate} = require('./schema');

class Asset {
    constructor(params) {
        const {error, value: validParams} = validate(params);
        if (error) {
            this.error = error;
        } else {
            Object.assign(this, validParams);
        }
    }
}

module.exports = {Asset};