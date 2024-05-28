import {
  requireNativeComponent,
  UIManager,
  Platform,
  type ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-view-module' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type ViewModuleProps = {
  color: string;
  style: ViewStyle;
};

const ComponentName = 'ViewModuleView';

export const ViewModuleView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<ViewModuleProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
