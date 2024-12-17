import {Platform} from 'react-native';

export interface ForceUpdateAppPayload {
  platform: typeof Platform.OS;
}
