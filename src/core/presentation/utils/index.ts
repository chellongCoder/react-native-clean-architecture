import {Dimensions, Platform} from 'react-native';
import {check, PERMISSIONS, request} from 'react-native-permissions';

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

export type TPermissionResponse = {
  result?: string;
  message: 'success' | 'fail';
};
export const CheckVoicePermission = async (): Promise<TPermissionResponse> => {
  try {
    if (Platform.OS === 'ios') {
      let result = await check(PERMISSIONS.IOS.MICROPHONE);
      if (result !== 'granted') {
        result = await request(PERMISSIONS.IOS.MICROPHONE);
        return {result: result, message: 'success'};
      }
      return {result: result, message: 'success'};
    } else {
      const result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      return {result: result, message: 'success'};
    }
  } catch (error) {
    return {message: 'fail'};
  }
};
