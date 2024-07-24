import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  UIManager,
  requireNativeComponent,
  type ViewStyle,
} from 'react-native';
import type { AppEntity } from './entities/AppEntity';
import type { BaseSyntheticEvent } from 'react';

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

export type FamilyActivitySelection = {
  applicationTokens: { data: string }[];
  categoryTokens: { data: string }[];
  includeEntireCategory: boolean;
  untokenizedApplicationIdentifiers: any[];
  untokenizedCategoryIdentifiers: any[];
  untokenizedWebDomainIdentifiers: any[];
  webDomainTokens: any[];
};
type ViewModuleProps = {
  style: ViewStyle;
  children: React.ReactNode;
  onChangeBlock: (
    e: BaseSyntheticEvent<{
      isBlocked: boolean;
      blockedApps: string;
    }>
  ) => void;
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

const myModuleEvt = new NativeEventEmitter(
  NativeModules.ScreenTimeSelectAppsModel
);

myModuleEvt.addListener('BlockApps', (data) => console.log('data event', data));
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

export function selectedAppsData(): Promise<string> {
  return ScreenTimeSelectApps.selectedAppsData();
}

export function unBlockApps(): Promise<boolean> {
  if (Platform.OS === 'android') {
    return AlphadexScreentime.unLockedApps();
  } else {
    return ScreenTimeSelectApps.unBlockApps();
  }
}

export function sentEvent(): Promise<boolean> {
  return ScreenTimeSelectApps.sentEvent();
}

export function getInstalledApps(
  includeSystemApps: boolean = true,
  includeAppIcons: boolean = true,
  onlyAppsWithLaunchIntent: boolean = true
): Promise<AppEntity[]> {
  return AlphadexScreentime.getInstalledApps(
    includeSystemApps,
    includeAppIcons,
    onlyAppsWithLaunchIntent
  );
}

export function askOverlayPermission(): Promise<boolean> {
  return AlphadexScreentime.askOverlayPermission();
}

export function checkOverlayPermission(): Promise<boolean> {
  return AlphadexScreentime.checkOverlayPermission();
}

export function hasUsageStatsPermission(): Promise<boolean> {
  return AlphadexScreentime.hasUsageStatsPermission();
}

export function startUsageStatsPermission(): Promise<boolean> {
  return AlphadexScreentime.startUsageStatsPermission();
}

export function requestPushNotificationPermission(): Promise<boolean> {
  return AlphadexScreentime.requestPushNotificationPermission();
}

export function checkAndRequestNotificationPermission(): Promise<boolean> {
  return AlphadexScreentime.checkAndRequestNotificationPermission();
}

export function addToLockedApps(
  arr: {
    app_name: string;
    package_name: string;
    file_path: string;
  }[]
): Promise<boolean> {
  return AlphadexScreentime.addToLockedApps(arr);
}
