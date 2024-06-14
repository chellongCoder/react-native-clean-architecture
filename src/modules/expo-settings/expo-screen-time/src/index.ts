import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoScreenTime.web.ts
// and on native platforms to ExpoScreenTime.ts
import ExpoScreenTimeModule from './ExpoScreenTimeModule';
import ExpoScreenTimeView from './ExpoScreenTimeView';
import { ChangeEventPayload, ExpoScreenTimeViewProps } from './ExpoScreenTime.types';

// Get the native constant value.
export const PI = ExpoScreenTimeModule.PI;

export function hello(): string {
  return ExpoScreenTimeModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoScreenTimeModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoScreenTimeModule ?? NativeModulesProxy.ExpoScreenTime);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoScreenTimeView, ExpoScreenTimeViewProps, ChangeEventPayload };
