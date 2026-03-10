module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
  dependencies: {
    'react-native-code-push': {
      platforms: {
        android: {
          sourceDir: 'node_modules/react-native-code-push/android/app',
        },
      },
    },
  },
};
