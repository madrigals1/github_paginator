const { validate } = require('./schema');

class Asset {
    constructor(params){
        const validation = validate(params);
        const { error, value: validParams } = validation;
        if (error) {
            this.error = error;
        } else {
            this.id = validParams.id;
            this.title = validParams.title;
            this.level = validParams.level;
            this.children = validParams.children;
            this.parent_id = validParams.parent_id;
        }
    }
}

module.exports = {Asset};