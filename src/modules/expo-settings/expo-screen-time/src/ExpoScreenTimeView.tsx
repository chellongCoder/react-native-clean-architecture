import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoScreenTimeViewProps } from './ExpoScreenTime.types';

const NativeView: React.ComponentType<ExpoScreenTimeViewProps> =
  requireNativeViewManager('ExpoScreenTime');

export default function ExpoScreenTimeView(props: ExpoScreenTimeViewProps) {
  return <NativeView {...props} />;
}
