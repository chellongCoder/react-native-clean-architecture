import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {injectable, provided} from 'inversify-sugar';
import {action, makeAutoObservable} from 'mobx';
import React, {RefObject} from 'react';

@injectable()
export class LessonStore {
  point: {value: number; isShow: boolean} = {value: 0, isShow: false};
  bottomSheetAppsRef?: RefObject<BottomSheetMethods>;

  bottomSheetPermissionRef?: RefObject<BottomSheetMethods>;

  constructor() {
    makeAutoObservable(this);
    this.bottomSheetAppsRef = React.createRef<BottomSheet>();
    this.bottomSheetPermissionRef = React.createRef<BottomSheet>();
  }

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
    this.bottomSheetAppsRef?.current?.collapse();
  };

  @action
  onShowSheetPermission = () => {
    this.bottomSheetPermissionRef?.current?.collapse();
  };
}
