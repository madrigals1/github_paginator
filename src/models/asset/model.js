const AssetSchema = require('./schema');

/**
 * <b>Asset</b> - represents the entity, loaded from <b>JSON</b>.
 * Can be anything that has <b>children</b> and/or <b>parent</b>.
 * <b>Params</b> of Asset will get <b>validated</b> before assigning to Asset object.
 * Invalid data will throw <b>HTTP</b> errors <b>400, 415, 422</b>
 * @class
 */
class Asset {
  /**
   * @param {object} params - Object with the list of params, provided in asset/schema.js
   * @param {number} params.id - identity field, used for identifying parent for children Assets.
   * @param {string} params.title - name of the Asset.
   * @param {number} params.level - hierarchical level of the Asset
   * @param {number[]} params.children - children of the Asset, by default should be empty
   * @param {number} params.parent_id - id of the parent Asset, can be null to represent
   * top level Asset.
   */
  constructor(params) {
    const { error, value: validParams } = this.validate(params);
    if (error) this.error = error;
    else Object.assign(this, validParams);
  }

  /**
   * Validation of given object using AssetSchema
   *
   * @method
   * @param {object} params - object that needs to be validated
   * @returns {object} validated object or object with error
   */
  validate = (params) => AssetSchema.validate(params);
}

module.exports = { Asset };
