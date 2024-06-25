import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {injectable, provided} from 'inversify-sugar';
import {action, makeAutoObservable, runInAction} from 'mobx';
import React, {RefObject} from 'react';
import {AppEntity} from 'src/modules/react-native-alphadex-screentime/src/entities/AppEntity';
import {getInstalledApps} from 'react-native-alphadex-screentime';

@injectable()
export class LessonStore {
  point: {value: number; isShow: boolean} = {value: 0, isShow: false};
  bottomSheetAppsRef?: RefObject<BottomSheetMethods>;

  bottomSheetPermissionRef?: RefObject<BottomSheetMethods>;

  listAppsSystem: AppEntity[] = [];

  blockedListAppsSystem: AppEntity[] = [];

  passwordParent?: string;

  constructor() {
    makeAutoObservable(this);
    this.bottomSheetAppsRef = React.createRef<BottomSheet>();
    this.bottomSheetPermissionRef = React.createRef<BottomSheet>();
    this.listAppsSystem = [];
    this.blockedListAppsSystem = [];
  }

  @action
  setBottomSheetAppsRef = () => {
    this.bottomSheetAppsRef = React.createRef<BottomSheet>();
  };

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
    this.onCloseSheetPermission();
    this.bottomSheetAppsRef?.current?.expand();
  };

  @action
  onCloseSheetApps = () => {
    this.bottomSheetAppsRef?.current?.close();
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

    runInAction(() => {
      this.listAppsSystem = [...apps];
    });
  };

  @action
  changeBlockedListAppSystem = async (arr: AppEntity[]) => {
    this.blockedListAppsSystem = arr;
  };
}
