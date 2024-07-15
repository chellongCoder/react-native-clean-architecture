import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {injectable, provided} from 'inversify-sugar';
import {action, makeAutoObservable, observable, runInAction} from 'mobx';
import React, {RefObject} from 'react';
import {AppEntity} from 'src/modules/react-native-alphadex-screentime/src/entities/AppEntity';
import {
  FamilyActivitySelection,
  getInstalledApps,
} from 'react-native-alphadex-screentime';
import UserSettingPayload from 'src/lesson/application/types/UserSettingPayload';
import UpdateUserSettingUseCase from 'src/lesson/application/useCases/UpdateUserSettingUseCase';
import Toast from 'react-native-toast-message';
import PostUserProgressUseCase from 'src/lesson/application/useCases/PostUserProgressUseCase';
import {TResult} from '../../screens/LessonScreen';

@injectable()
export class LessonStore {
  point: {value: number; isShow: boolean} = {value: 0, isShow: false};
  bottomSheetAppsRef?: RefObject<BottomSheetMethods>;

  bottomSheetPermissionRef?: RefObject<BottomSheetMethods>;

  listAppsSystem: AppEntity[] = [];

  blockedListAppsSystem: AppEntity[] = [];

  @observable blockedAnonymousListAppsSystem?: FamilyActivitySelection;

  passwordParent?: string;

  @observable isLoadingUserSetting = false;

  constructor(
    @provided(UpdateUserSettingUseCase)
    private userSettingUserCase: UpdateUserSettingUseCase,
    @provided(PostUserProgressUseCase)
    private postUserProgressUseCase: PostUserProgressUseCase,
  ) {
    makeAutoObservable(this);
    this.bottomSheetAppsRef = React.createRef<BottomSheet>();
    this.bottomSheetPermissionRef = React.createRef<BottomSheet>();
    this.listAppsSystem = [];
    this.blockedListAppsSystem = [];

    this.updateAppBlock = this.updateAppBlock.bind(this);
    this.handlePostUserProgress = this.handlePostUserProgress.bind(this);
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
  resetListAppSystem = async () => {
    this.blockedListAppsSystem = [];
  };

  @action
  changeBlockedListAppSystem = async (arr: AppEntity[]) => {
    this.blockedListAppsSystem = arr;
  };

  @action
  changeBlockedAnonymousListAppSystem = async (
    arr?: FamilyActivitySelection,
  ) => {
    this.blockedAnonymousListAppsSystem = arr;
  };

  @action
  updateAppBlock = async (setting: UserSettingPayload) => {
    console.log(
      '🛠 LOG: 🚀 --> ------------------------------------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log(
      '🛠 LOG: 🚀 --> ~ LessonStore ~ updateAppBlock= ~ setting:',
      setting,
    );
    console.log(
      '🛠 LOG: 🚀 --> ------------------------------------------------------------------🛠 LOG: 🚀 -->',
    );
    try {
      this.isLoadingUserSetting = true;
      const response = await this.userSettingUserCase.execute(setting);
      Toast.show({
        type: 'success',
        text1: response.message,
      });
    } catch (error) {
      console.log(
        '🛠 LOG: 🚀 --> --------------------------------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log(
        '🛠 LOG: 🚀 --> ~ LessonStore ~ updateAppBlock= ~ error:',
        error,
      );
      console.log(
        '🛠 LOG: 🚀 --> --------------------------------------------------------------🛠 LOG: 🚀 -->',
      );
      Toast.show({
        type: 'error',
        text1: error?.message,
      });
    } finally {
      this.isLoadingUserSetting = false;
    }
  };

  @action
  public async handlePostUserProgress(data: TResult[]) {
    console.log('handlePostUserProgress: ', data);
    const response = await this.postUserProgressUseCase.execute(data);
    console.log('handlePostUserProgressResponse: ', response);
    return response;
  }
}
