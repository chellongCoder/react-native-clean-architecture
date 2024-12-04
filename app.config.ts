import {ExpoConfig} from '@expo/config-types';
import packageJson from './package.json';

const appConfig: ExpoConfig = {
  name: 'ABeeCi',
  slug: 'abeeci',
  scheme: 'rnca',
  version: packageJson.version,
  entryPoint: './index.js',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    package: 'com.carlossalasamper.reactnativecleanarchitecture',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    EXPO_BASE_API_DOMAIN: 'https://dev.tbd-alphadex.com',
    EXPO_BASE_API_URL: 'https://dev.tbd-alphadex.com',
    EXPO_IOS_CLIENT_ID:
      '827845646125-49mekr1f87vgc0d40bj06llmoe2mvkq3.apps.googleusercontent.com',

    IMAGE_QUESTION_BASE_API_URL:
      'https://storage.googleapis.com/alphadex-image-abeeci/question-image/',
    IMAGE_MODULE_BASE_API_URL:
      'https://storage.googleapis.com/alphadex-image-abeeci/module-images/',
    IMAGE_BACKGROUND_BASE_API_URL:
      'https://storage.googleapis.com/alphadex-image-abeeci/backgrounds/',
  },
};
//storage.googleapis.com/alphadex-image-abeeci/backgrounds/
//storage.googleapis.com/alphadex-image-abeeci/module-images/
//storage.googleapis.com/alphadex-image-abeeci/question-image/

export default appConfig;
