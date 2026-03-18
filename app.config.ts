import {ExpoConfig} from '@expo/config-types';
import packageJson from './package.json';

const appConfig: ExpoConfig = {
  name: 'ABeeCi',
  slug: 'abeeci',
  scheme: 'abeeci',
  version: packageJson.version,
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
    package: 'com.algorz.abeeci.app',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  plugins: ['expo-font', 'expo-localization'],
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    EXPO_BASE_API_DOMAIN: 'https://dev.tbd-alphadex.com',
    EXPO_BASE_API_URL: 'https://dev.tbd-alphadex.com',
    EXPO_BASE_V1_API_DOMAIN: 'https://v1.tbd-alphadex.com',
    EXPO_IOS_CLIENT_ID:
      '827845646125-gle21suv3a6pe4tgdma4ch04h359c6ds.apps.googleusercontent.com',
    WEB_CLIENT_ID:
      '595720239925-07lrrs6cdtn8h7782puuogi591ln8umu.apps.googleusercontent.com',
    IMAGE_QUESTION_BASE_API_URL:
      'https://storage.googleapis.com/algorz-image-abeeci/question-image/',
    IMAGE_MODULE_BASE_API_URL:
      'https://storage.googleapis.com/algorz-image-abeeci/module-images/',
    IMAGE_BACKGROUND_BASE_API_URL:
      'https://storage.googleapis.com/algorz-image-abeeci/backgrounds/',
    CODEPUSH_SERVER_URL: 'https://code-push.tbd-alphadex.com/',
    CODEPUSH_DEPLOYMENT_KEY: '0Stgs2wPTZDLsxQQlEsaSQ7XKBr74ksvOXqog',
  },
};
//storage.googleapis.com/algorz-image-abeeci/backgrounds/
//storage.googleapis.com/algorz-image-abeeci/module-images/
//storage.googleapis.com/algorz-image-abeeci/question-image/

export default appConfig;
