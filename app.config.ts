import {ExpoConfig} from '@expo/config-types';
import packageJson from './package.json';

const googleMobileAdsPlugin = [
  'react-native-google-mobile-ads',
  {
    android_app_id: 'ca-app-pub-5805531559546260~4810118019',
    ios_app_id: 'ca-app-pub-9069193131931191~1945807999',
    skAdNetworkItems: [
      'cstr6suwn9.skadnetwork',
      '4fzdc2evr5.skadnetwork',
      '4pfyvq9l8r.skadnetwork',
      '2fnua5tdw4.skadnetwork',
      'ydx93a7ass.skadnetwork',
      '5a6flpkh64.skadnetwork',
      'p78axxw29g.skadnetwork',
      'v72qych5uu.skadnetwork',
      'ludvb6z3bs.skadnetwork',
      'cp8zw746q7.skadnetwork',
      '3sh42y64q3.skadnetwork',
      'c6k4g5qg8m.skadnetwork',
      's39g8k73mm.skadnetwork',
      '3qy4746246.skadnetwork',
      'f38h382jlk.skadnetwork',
      'hs6bdukanm.skadnetwork',
      'v4nxqhlyqp.skadnetwork',
      'wzmmz9fp6w.skadnetwork',
      'yclnxrl5pm.skadnetwork',
      't38b2kh725.skadnetwork',
      '7ug5zh24hu.skadnetwork',
      'gta9lk7p23.skadnetwork',
      'vutu7akeur.skadnetwork',
      'y5ghdn5j9k.skadnetwork',
      'n6fk4nfna4.skadnetwork',
      'v9wttpbfk9.skadnetwork',
      'n38lu8286q.skadnetwork',
      '47vhws6wlr.skadnetwork',
      'kbd757ywx3.skadnetwork',
      '9t245vhmpl.skadnetwork',
      'eh6m2bh4zr.skadnetwork',
      'a2p9lx4jpn.skadnetwork',
      '22mmun2rn5.skadnetwork',
      '4468km3ulz.skadnetwork',
      '2u9pt9hc89.skadnetwork',
      '8s468mfl3y.skadnetwork',
      'klf5c3l5u5.skadnetwork',
      'ppxm28t8ap.skadnetwork',
      'ecpz2srf59.skadnetwork',
      'uw77j35x4d.skadnetwork',
      'pwa73g5rt2.skadnetwork',
      'mlmmfzh3r3.skadnetwork',
      '578prtvx9j.skadnetwork',
      '4dzt52r2t5.skadnetwork',
      'e5fvkxwrpn.skadnetwork',
      '8c4e2ghe7u.skadnetwork',
      'zq492l623r.skadnetwork',
      '3rd42ekr43.skadnetwork',
      '3qcr597p9d.skadnetwork',
    ],
    userTrackingUsageDescription:
      'This identifier will be used to deliver personalized ads to you.',
  },
] as const;

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
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'ABeeCi uses your location only when needed to support location-based device or account flows.',
    },
  },
  android: {
    package: 'com.algorz.abeeci.app',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  plugins: ['expo-font', 'expo-localization', googleMobileAdsPlugin],
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
