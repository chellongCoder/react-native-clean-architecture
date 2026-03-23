import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {injectable, provided} from 'inversify-sugar';
import {
  action,
  computed,
  makeAutoObservable,
  observable,
  runInAction,
} from 'mobx';
import React, {RefObject} from 'react';
import {AppEntity} from 'src/modules/react-native-alphadex-screentime/src/entities/AppEntity';
import {
  FamilyActivitySelection,
  getInstalledApps,
} from 'react-native-alphadex-screentime';
import UserSettingPayload, {
  BlockedModuleSetting,
} from 'src/lesson/application/types/UserSettingPayload';
import UpdateUserSettingUseCase from 'src/lesson/application/useCases/UpdateUserSettingUseCase';
import Toast from 'react-native-toast-message';
import PostUserProgressUseCase from 'src/lesson/application/useCases/PostUserProgressUseCase';
import {TResult} from '../../screens/LessonScreen';
import GetUserSettingUseCase from 'src/lesson/application/useCases/GetUserSettingUseCase';
import {isAndroid, sortAppsByName} from 'src/core/presentation/utils';
import {AppCategoryE} from 'src/core/domain/enums/AppCategoryE';
import GetReportProgressChildrenUseCase from 'src/lesson/application/useCases/GetReportProgressChildrenUsecase';
import ReportProgressChildrenPayload from 'src/lesson/application/types/ReportProgressChildrenPayload';
import RankingOfChildPayload from 'src/lesson/application/types/RankingOfChildPayload';
import TopRankingPayload from 'src/lesson/application/types/TopRankingPayload';
import GetRankingOfChildUseCase from 'src/lesson/application/useCases/GetRankingOfChildUseCase';
import GetTopRankingUseCase from 'src/lesson/application/useCases/GetTopRankingUseCase';
import {TRAINING_COUNT} from 'src/core/domain/enums/ModuleE';
import {persist, create} from 'mobx-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChangeChildPointFlowerUsecase from 'src/authentication/application/useCases/ChangeChildPointFlowerUsecase';
import {ChangeChildPointFlowerPayload} from 'src/authentication/application/types/ChangeChildPointFlowerPayload';
import {LessonSettingT} from 'src/home/application/types/GetListQuestionResponse';
import PurchaseModuleUseCase from 'src/lesson/application/useCases/PurchaseModuleUseCase';
import PurchaseModulePayload from 'src/lesson/application/types/PurchaseModulePayload';
import GetProductUseCase from 'src/lesson/application/useCases/getProductUseCase';
import GetListModuleByFieldUseCase from 'src/home/application/useCases/GetListModuleByFieldUseCase';
import GetListModuleByChildrenUseCase from 'src/home/application/useCases/GetListModuleByChildrenUseCase';
import {GetListSubjectPayload} from 'src/home/application/types/GetListSubjectPayload';
import {GetListModulesChildrenPayload} from 'src/home/application/types/GetListModulesChildrenPayload';
import {Module} from 'src/home/application/types/GetListLessonResponse';
import ImageToTextUsecase from 'src/authentication/application/useCases/ImageToTextUsecase';
import GetUserModuleUseCase from 'src/lesson/application/useCases/GetUserModuleUseCase';
import BuyUserModuleUseCase from 'src/lesson/application/useCases/BuyUserModuleUseCase.ts';
import UserModuleEntity from 'src/lesson/domain/entities/UserModuleEntity';
import BuyUserModulePayload from 'src/lesson/application/types/BuyUserModulePayload';
import TranslateTextUsecase from 'src/authentication/application/useCases/TranslateTextUsecase';
import {TranslateTextPayload} from 'src/authentication/application/types/TranslateTextPayload';
import {HomeStore} from 'src/home/presentation/stores/HomeStore';
import I18n from 'src/core/presentation/i18n';
@injectable()
export class LessonStore {
  point: {value: number; isShow: boolean} = {value: 0, isShow: false};
  bottomSheetAppsRef?: RefObject<BottomSheetMethods>;

  bottomSheetPermissionRef?: RefObject<BottomSheetMethods>;

  listAppsSystem: AppEntity[] = [];

  @observable blockedListAppsSystem: Partial<AppEntity>[] = [];

  @observable blockedAnonymousListAppsSystem?: Partial<FamilyActivitySelection>;

  passwordParent?: string;

  @observable isLoadingUserSetting = false;
  unlockPercent = 0;

  @observable isOverlay?: boolean;
  @observable isUsageStats?: boolean;
  @observable isPushNoti?: boolean;
  @observable trainingCount = TRAINING_COUNT;
  @persist('list') @observable currentQuestion: Array<{
    lessonId: string;
    questionIndex: number;
    activeTaskIndex: number;
  }> = [];

  getQuestionByLessonId(lessonId: string) {
    return (this.currentQuestion ?? []).find(q => q.lessonId === lessonId);
  }

  removeQuestionByLessonId(lessonId: string) {
    this.currentQuestion = (this.currentQuestion ?? []).filter(
      q => q.lessonId !== lessonId,
    );
  }

  @action
  upsertQuestion(
    lessonId: string,
    questionIndex: number,
    activeTaskIndex: number,
  ) {
    if (!this.currentQuestion) {
      this.currentQuestion = [];
    }
    const idx = this.currentQuestion.findIndex(q => q.lessonId === lessonId);
    if (idx >= 0) {
      this.currentQuestion[idx] = {lessonId, questionIndex, activeTaskIndex};
    } else {
      this.currentQuestion.push({lessonId, questionIndex, activeTaskIndex});
    }
  }

  @observable isShowHint = false;
  @observable productFromBE = [];

  @observable listModuleByField: Module[] = [];

  @observable listModuleByChildren: Module[] = [];

  @persist @observable backgroundSound = 0.8;
  @persist @observable charSound = 0.3;

  @persist('list') @observable blockedModules?: BlockedModuleSetting[] = [];

  @observable userModule: UserModuleEntity[] = [];

  @observable modulesBySubject: Module[] = [];
  @observable isLoadingModulesBySubject = false;

  @computed getSetting(lessonSetting?: LessonSettingT) {
    return {
      backgroundAnswerColor: lessonSetting?.backgroundColor,
      prompt: lessonSetting?.prompt,
      ...lessonSetting,
    };
  }

  constructor(
    @provided(UpdateUserSettingUseCase)
    private userSettingUserCase: UpdateUserSettingUseCase,
    @provided(GetReportProgressChildrenUseCase)
    private getReportProgressChildrenUseCase: GetReportProgressChildrenUseCase,
    @provided(GetRankingOfChildUseCase)
    private getRankingOfChild: GetRankingOfChildUseCase,
    @provided(GetTopRankingUseCase)
    private getTopRanking: GetTopRankingUseCase,
    @provided(PostUserProgressUseCase)
    private postUserProgressUseCase: PostUserProgressUseCase,
    @provided(GetUserSettingUseCase)
    private getUserSettingUserCase: GetUserSettingUseCase,
    @provided(ImageToTextUsecase)
    private imageToTextUseCase: ImageToTextUsecase,
    @provided(TranslateTextUsecase)
    private translateTextUseCase: TranslateTextUsecase,
    @provided(ChangeChildPointFlowerUsecase)
    private changeChildPointFlowerUseCase: ChangeChildPointFlowerUsecase,
    @provided(PurchaseModuleUseCase)
    private purchaseModuleUseCase: PurchaseModuleUseCase,
    @provided(GetProductUseCase)
    private getProductUseCase: GetProductUseCase,
    @provided(GetListModuleByFieldUseCase)
    private getListModuleByFieldUseCase: GetListModuleByFieldUseCase,
    @provided(GetListModuleByChildrenUseCase)
    private getListModuleByChildrenUseCase: GetListModuleByChildrenUseCase,
    @provided(GetUserModuleUseCase)
    private getUserModuleUseCase: GetUserModuleUseCase,
    @provided(BuyUserModuleUseCase)
    private buyUserModuleUseCase: BuyUserModuleUseCase,
  ) {
    makeAutoObservable(this);
    this.bottomSheetAppsRef = React.createRef<BottomSheet>();
    this.bottomSheetPermissionRef = React.createRef<BottomSheet>();
    this.listAppsSystem = [];
    this.blockedListAppsSystem = [];

    this.updateAppBlock = this.updateAppBlock.bind(this);
    this.handleGetReportProgressChildren =
      this.handleGetReportProgressChildren.bind(this);
    this.handleGetRankingOfChild = this.handleGetRankingOfChild.bind(this);
    this.handleGetTopRanking = this.handleGetTopRanking.bind(this);
    this.handlePostUserProgress = this.handlePostUserProgress.bind(this);
    this.handleGetSettingUser = this.handleGetSettingUser.bind(this);
    this.setTrainingCount = this.setTrainingCount.bind(this);
    this.setCurrentQuestion = this.setCurrentQuestion.bind(this);
    this.handlePurchaseModule = this.handlePurchaseModule.bind(this);
    this.handleGetProductFromBE = this.handleGetProductFromBE.bind(this);
    this.handleGetModulesField = this.handleGetModulesField.bind(this);
    this.handleGetModulesChildren = this.handleGetModulesChildren.bind(this);
    this.imageToText = this.imageToText.bind(this);
    this.translateText = this.translateText.bind(this);
  }

  @action
  setCharSound = (e: number) => {
    this.charSound = e;
  };

  @action
  setBackgroundSound = (e: number) => {
    this.backgroundSound = e;
  };

  @action
  setCurrentQuestion = (q: typeof this.currentQuestion) => {
    this.currentQuestion = q;
  };

  @action
  setTrainingCount = (count: number) => {
    this.trainingCount = count;
  };

  @action
  setIsOverlay = (bool: boolean) => {
    this.isOverlay = bool;
  };

  @action
  setIsUsageStats = (bool: boolean) => {
    this.isUsageStats = bool;
  };

  @action
  setIsPushNoti = (bool: boolean) => {
    this.isPushNoti = bool;
  };

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
    getInstalledApps().then(apps => {
      runInAction(() => {
        this.listAppsSystem = sortAppsByName([...apps]);
      });
      return apps;
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
  public async handleGetReportProgressChildren(
    data: ReportProgressChildrenPayload,
  ) {
    const response = await this.getReportProgressChildrenUseCase.execute(data);
    return response;
  }

  @action
  public async handleGetRankingOfChild(data: RankingOfChildPayload) {
    const response = await this.getRankingOfChild.execute(data);
    return response;
  }

  @action
  public async handleGetTopRanking(data: TopRankingPayload) {
    const response = await this.getTopRanking.execute(data);
    return response;
  }

  @action
  public async handlePostUserProgress(data: TResult[]) {
    const response = await this.postUserProgressUseCase.execute(data);
    return response;
  }

  @action
  public async handleGetModulesField(field: GetListSubjectPayload) {
    const response = await this.getListModuleByFieldUseCase.execute(field);
    this.listModuleByField = response.data;
    return response;
  }

  @action
  public async handleGetModulesChildren(
    children: GetListModulesChildrenPayload,
  ) {
    const response = await this.getListModuleByChildrenUseCase.execute(
      children,
    );
    this.listModuleByChildren = response.data;
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
      this.blockedModules = response.data?.modules;
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

  @action
  public async imageToText(data: FormData) {
    this.isLoadingUserSetting = true;
    const response = await this.imageToTextUseCase.execute(data);
    this.isLoadingUserSetting = false;
    return response;
  }

  @action
  public async translateText(data: TranslateTextPayload) {
    this.isLoadingUserSetting = true;
    const response = await this.translateTextUseCase.execute(data);
    this.isLoadingUserSetting = false;
    return response;
  }

  @action
  public async changeChildrenPointFlower(data: ChangeChildPointFlowerPayload) {
    this.isLoadingUserSetting = true;
    const response = await this.changeChildPointFlowerUseCase.execute(data);
    this.isLoadingUserSetting = false;
    return response;
  }

  @action
  public async handlePurchaseModule(data: PurchaseModulePayload) {
    const response = await this.purchaseModuleUseCase.execute(data);
    return response;
  }

  @action
  public async handleGetProductFromBE() {
    const response = await this.getProductUseCase.execute();
    this.productFromBE = response.data;
    return response;
  }

  @action
  toggleUseHint = () => {
    this.isShowHint = !this.isShowHint;
  };

  @action
  public async handleGetUserModule(modules: Module[], excludes?: number[]) {
    const response = await this.getUserModuleUseCase.execute(
      excludes?.length
        ? {
            exclude: excludes.join(','),
          }
        : undefined,
    );
    this.userModule = response.map(module => {
      const moduleItem = modules.find(m => m._id === module.lessonId);
      return {
        id: module.lessonId,
        name: moduleItem?.title ?? '',
        description: moduleItem?.description ?? '',
        price: 10,
        isPurchased: true,
      };
    });
    return response;
  }

  @action
  public async handleBuyUserModule(data: BuyUserModulePayload) {
    const response = await this.buyUserModuleUseCase.execute(data);
    return response;
  }

  @action
  public async handleGetModulesBySubject(
    homeStore: HomeStore,
    i18n: I18n,
    childrenId: string,
    subjectId: string,
  ) {
    this.isLoadingModulesBySubject = true;
    homeStore
      .getListModules({
        subjectId: subjectId,
        childrenId: childrenId,
      })
      .then(response => {
        const listTitle = response.data.map(item => item.description);
        const listDesc = response.data.map(
          item => item.tasks?.map(task => task.description).toString() ?? '',
        );
        Promise.all([
          this.translateText({
            text: listTitle,
            targetLanguage: i18n.deviceLocale,
          }),
          this.translateText({
            text: listDesc,
            targetLanguage: i18n.deviceLocale,
          }),
        ])
          .then(([resTitle, resDesc]) => {
            const translatedModules = response.data.map((item, index) => ({
              ...item,
              name: resTitle.data[index],
              tasks: item.tasks?.map((task, i) => ({
                ...task,
                description: (resDesc.data[index] ?? '').split(',')[i], // split by comma and get the index of the task
              })),
            }));
            this.modulesBySubject = translatedModules;
          })
          .catch(() => {
            this.modulesBySubject = response.data;
          })
          .finally(() => {
            this.isLoadingModulesBySubject = false;
          });
      })
      .catch(() => {
        this.isLoadingModulesBySubject = false;
      });
  }
}

export const hydrate = create({
  storage: AsyncStorage, // or AsyncStorage in react-native.
  // default: localStorage
  jsonify: true, // if you use AsyncStorage, here shoud be true
  // default: true
});
