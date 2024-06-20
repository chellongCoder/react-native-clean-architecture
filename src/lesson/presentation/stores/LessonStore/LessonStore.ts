import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {injectable, provided} from 'inversify-sugar';
import {action, makeAutoObservable, runInAction} from 'mobx';
import React, {RefObject} from 'react';
import {AppEntity} from 'src/modules/react-native-alphadex-screentime/src/entities/AppEntity';
import {getInstalledApps} from 'react-native-alphadex-screentime';
import {InstalledApps} from 'react-native-launcher-kit';

@injectable()
export class LessonStore {
  point: {value: number; isShow: boolean} = {value: 0, isShow: false};
  bottomSheetAppsRef?: RefObject<BottomSheetMethods>;

  bottomSheetPermissionRef?: RefObject<BottomSheetMethods>;

  listAppsSystem: AppEntity[] = [];

  passwordParent?: string;

  constructor() {
    makeAutoObservable(this);
    this.bottomSheetAppsRef = React.createRef<BottomSheet>();
    this.bottomSheetPermissionRef = React.createRef<BottomSheet>();
    this.listAppsSystem = [];
  }

  @action
  setPasswordParent = (password: string) => {
    this.passwordParent = password;
  };

  @action
  setIsShow = (bool: boolean) => {
    this.point.isShow = bool;
  };

  @action
  setPoint = (score: number) => {
    this.point.value = score;
  };

  @action
  onShowSheetApps = () => {
    this.bottomSheetPermissionRef?.current?.close();
    this.bottomSheetAppsRef?.current?.expand();
  };

  @action
  onShowSheetPermission = () => {
    this.bottomSheetPermissionRef?.current?.snapToIndex(1);
  };

  @action
  onCloseSheetPermission = () => {
    this.bottomSheetPermissionRef?.current?.close();
  };

  changeListAppSystem = async () => {
    const apps = await getInstalledApps();
    console.log(
      '🛠 LOG: 🚀 --> -----------------------------------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log(
      '🛠 LOG: 🚀 --> -----------------------------------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log(
      '🛠 LOG: 🚀 --> ~ LessonStore ~ changeListAppSystem= ~ apps:',
      apps,
    );
    console.log(
      '🛠 LOG: 🚀 --> -----------------------------------------------------------------🛠 LOG: 🚀 -->',
    );

    runInAction(() => {
      this.listAppsSystem = [...apps];
    });
  };
}
