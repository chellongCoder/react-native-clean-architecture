import {ExpoConfig} from '@expo/config-types';
import packageJson from './package.json';

const appConfig: ExpoConfig = {
  name: 'BTD-Edu',
  slug: 'BTD-Edu',
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
    EXPO_BASE_API_DOMAIN: 'https://google.tbd-alphadex.com',
    EXPO_BASE_API_URL: 'https://google.tbd-alphadex.com',
    IMAGE_QUESTION_BASE_API_URL:
      'https://storage.googleapis.com/alphadex-image/question-image/',
    IMAGE_MODULE_BASE_API_URL:
      'https://storage.googleapis.com/alphadex-image/module-images/',
    IMAGE_BACKGROUND_BASE_API_URL:
      'https://storage.googleapis.com/alphadex-image/backgrounds/',
  },
};

export default appConfig;
