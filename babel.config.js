module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "module:metro-react-native-babel-preset"],
    plugins: [
      "babel-plugin-transform-typescript-metadata",
      'react-native-reanimated/plugin',
      [
        "module-resolver",
        {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
          root: ["."],
        },
      ],
    ],
  };
};
