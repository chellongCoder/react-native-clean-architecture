import {Dimensions, Platform} from 'react-native';

export * from './assets';

export const isAndroid = Platform.OS === 'android';

export const {width: WIDTH_SCREEN, height: HEIGHT_SCREEN} =
  Dimensions.get('window');
