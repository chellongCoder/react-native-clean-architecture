import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

export const generateShortUUID = (): string => {
  const uuid = uuidv4();
  return Buffer.from(uuid.replace(/-/g, ''), 'hex')
    .toString('base64') // 24
    .substring(0, 22);
};

export const generateFullUUID = (): string => {
  const uuid = uuidv4();
  return uuid; // 24
};

export enum LoginMethods {
  UsernamePassword = 'UsernamePassword',
  FourG = 'FourG',
  Google = 'Google',
  Apple = 'Apple',
  Facebook = 'Facebook',
}
