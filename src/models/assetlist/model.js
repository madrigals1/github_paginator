'use strict';

class AssetList {
    static assets = {};

    static addAsset = (asset) => {
        this.assets[asset.id] = asset;
    };

    static getAsset = (assetId) => {
        return this.assets[assetId];
    };

    static getAssetsHierarchy = () => {
        const hierarchy = [];
        for (let i of Object.keys(this.assets)) {
            if (this.assets[i].parent_id === null) {
                // If asset has no parent_id, should go to top level array
                hierarchy.push(this.getAsset(this.assets[i].id));
            } else {
                // Just adding the asset of lower level to its parent's children array
                this.getAsset(this.assets[i].parent_id).children.push(this.assets[i]);
            }
        }
        return hierarchy;
    };
}

module.exports = {AssetList};