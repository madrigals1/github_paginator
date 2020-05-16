class AssetList {
    static assets = {};
    static modifiedAssets = {};

    static addAsset = (asset) => {
        this.assets[asset.id] = asset;
    };

    static getAsset = (assetId) => {
        return this.assets[assetId];
    };

    // Mapping and sorting assets from lowest level to highest 2, 1, 0
    static modifyAssets = () => {
        const mappedAssets = Object.keys(this.assets).map((key) => this.assets[key]);
        const sortedAssets = mappedAssets.sort((a, b) => b.level - a.level);

        for(let asset of sortedAssets) {
            if(asset.parent_id === null) {
                return this.getAsset(asset.id);
            }
            // Just adding the asset of lowest level to its parent's children array
            this.getAsset(asset.parent_id).children.push(asset);
        }
    };
}

module.exports = { AssetList };