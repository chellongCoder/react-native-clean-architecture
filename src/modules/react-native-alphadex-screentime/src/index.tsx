import {
  NativeModules,
  Platform,
  UIManager,
  requireNativeComponent,
  type ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-alphadex-screentime' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const AlphadexScreentime = NativeModules.AlphadexScreentime
  ? NativeModules.AlphadexScreentime
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default AlphadexScreentime;

type ViewModuleProps = {
  color: string;
  style: ViewStyle;
};

const ComponentName = 'ViewModuleView';

export const ScreenTimeComponent =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<ViewModuleProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

export function multiply(a: number, b: number): Promise<number> {
  return AlphadexScreentime.multiply(a, b);
}

const ScreenTimeSelectApps = NativeModules.ScreenTimeSelectAppsModel
  ? NativeModules.ScreenTimeSelectAppsModel
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );
export function requestScreenTime(): Promise<boolean> {
  return ScreenTimeSelectApps.requestScreenTime();
}

export function selectedAppsData(): Promise<boolean> {
  return ScreenTimeSelectApps.selectedAppsData();
}