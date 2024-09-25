import {Dimensions, Platform} from 'react-native';

export * from './assets';

export const isAndroid = Platform.OS === 'android';

export const {width: WIDTH_SCREEN, height: HEIGHT_SCREEN} =
  Dimensions.get('window');

/**
 *
 * @param {string} tag
 * @param {string} type
 * @param {string} value
 */
export function Logger(tag = 'AD', type: string, value?: any) {
  console.log(`[${tag}][${type}]:`, value);
}

export function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
