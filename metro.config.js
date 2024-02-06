const path = require('path');
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => path.join(process.cwd(), `src/${name}`),
      },
    ),
  },
  watchFolders: [path.resolve(__dirname, 'src')],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
