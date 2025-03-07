module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./src'],
            extensions: [
              '.ios.js',
              '.android.js',
              '.js',
              '.jsx',
              '.json',
            ],
            alias: {
              '@presentation': './src/presentation',
              '@domain': './src/domain',
              '@data': './src/data',
              '@utils': './src/utils'
            }
          }
        ]
      ]
    };
  };