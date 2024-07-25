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
import GetUserSettingUseCase from 'src/lesson/application/useCases/GetUserSettingUseCase';
import {isAndroid} from 'src/core/presentation/utils';
import {AppCategoryE} from 'src/core/domain/enums/AppCategoryE';

@injectable()
export class LessonStore {
  point: {value: number; isShow: boolean} = {value: 0, isShow: false};
  bottomSheetAppsRef?: RefObject<BottomSheetMethods>;

  bottomSheetPermissionRef?: RefObject<BottomSheetMethods>;

  listAppsSystem: AppEntity[] = [];

  blockedListAppsSystem: Partial<AppEntity>[] = [];

  @observable blockedAnonymousListAppsSystem?: Partial<FamilyActivitySelection>;

  passwordParent?: string;

  @observable isLoadingUserSetting = false;
  unlockPercent = 0;

  constructor(
    @provided(UpdateUserSettingUseCase)
    private userSettingUserCase: UpdateUserSettingUseCase,
    @provided(PostUserProgressUseCase)
    private postUserProgressUseCase: PostUserProgressUseCase,
    @provided(GetUserSettingUseCase)
    private getUserSettingUserCase: GetUserSettingUseCase,
  ) {
    makeAutoObservable(this);
    this.bottomSheetAppsRef = React.createRef<BottomSheet>();
    this.bottomSheetPermissionRef = React.createRef<BottomSheet>();
    this.listAppsSystem = [];
    this.blockedListAppsSystem = [];

    this.updateAppBlock = this.updateAppBlock.bind(this);
    this.handlePostUserProgress = this.handlePostUserProgress.bind(this);
    this.handleGetSettingUser = this.handleGetSettingUser.bind(this);
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
  setUnlockPercent = (percent: number) => {
    this.unlockPercent = percent;
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
    try {
      this.isLoadingUserSetting = true;
      const response = await this.userSettingUserCase.execute(setting);
      Toast.show({
        type: 'success',
        text1: response.message,
      });
    } catch (error: any) {
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
    const response = await this.postUserProgressUseCase.execute(data);
    return response;
  }

  @action
  public async handleGetSettingUser({
    deviceToken,
    childrenId,
  }: UserSettingPayload) {
    try {
      const response = await this.getUserSettingUserCase.execute({
        deviceToken,
        childrenId,
      });
      if (!isAndroid) {
        this.blockedAnonymousListAppsSystem = {
          categoryTokens: response?.data?.appBlocked?.ios
            ?.filter(v => v.category === AppCategoryE.CATEGORY)
            ?.map(token => {
              return {data: token.token};
            }),
          applicationTokens: response.data?.appBlocked?.ios
            ?.filter(v => v.category === AppCategoryE.APP)
            ?.map(token => {
              return {
                data: token.token,
              };
            }),
          includeEntireCategory: true,
        };
      } else {
        this.blockedListAppsSystem =
          response?.data?.appBlocked?.android?.map(a => {
            const icon =
              this.listAppsSystem.find(e => e.package_name === a.id)
                ?.app_icon ?? '';
            return {
              package_name: a.token,
              app_icon: icon,
              app_name: a.name,
              category: 1,
            };
          }) ?? [];
      }
      this.setUnlockPercent(response?.data?.point ?? 0);
      return response;
    } catch (error) {
      console.log(
        '🛠 LOG: 🚀 --> -------------------------------------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log(
        '🛠 LOG: 🚀 --> ~ LessonStore ~ handleGetSettingUser ~ error:',
        error,
      );
      console.log(
        '🛠 LOG: 🚀 --> -------------------------------------------------------------------🛠 LOG: 🚀 -->',
      );
    }
  }
}
