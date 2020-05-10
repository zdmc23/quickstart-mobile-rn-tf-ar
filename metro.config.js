// get defaults assetExts array
const defaultAssetExts = require("metro-config/src/defaults/defaults").assetExts;

// Change 1 (import the blacklist utility)
const blacklist = require('metro-config/src/defaults/blacklist');
 
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    // Change 2 (add 'bin' to assetExts)
    assetExts: [
      ...defaultAssetExts,
      'mtl',
      'obj',
      'bin',
      'txt',
      'jpg'
    ],
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
    // Change 3 (add platform_node to blacklist)
    blacklistRE: blacklist([/platform_node/])
  },
};
