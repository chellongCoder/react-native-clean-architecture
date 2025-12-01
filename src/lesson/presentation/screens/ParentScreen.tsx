import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import IconUser from 'assets/svg/IconUser';
import PrimaryButton from '../components/PrimaryButton';
import ItemCard from '../components/ItemCard';
import IconListen from 'assets/svg/IconListen';
import IconBrightness from 'assets/svg/IconBrightness';
import IconTheme from 'assets/svg/IconTheme';
import Volume from '../components/Volume';
import BookView from '../components/BookView';
import {useLessonStore} from '../stores/LessonStore/useGetPostsStore';
import {observer} from 'mobx-react';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {LessonStoreProvider} from '../stores/LessonStore/LessonStoreProvider';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {children} from 'src/authentication/application/types/GetUserProfileResponse';
import ICAddChild from 'src/core/components/icons/ICAddChild';
import {COLORS} from 'src/core/presentation/constants/colors';
import ICManIconMedium from 'src/core/components/icons/ICManIconMedium';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  pushScreen,
  resetNavigator,
} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {
  CustomTextStyle,
  TYPOGRAPHY,
} from 'src/core/presentation/constants/typography';
import AccountStatus from 'src/home/presentation/components/AccountStatus';
import Username from '../components/Username';
import {useAsyncEffect} from 'src/core/presentation/hooks';
import SelectApp from '../components/LessonModule/SelectApp';
import {
  HEIGHT_SCREEN,
  isAndroid,
  WIDTH_SCREEN,
} from 'src/core/presentation/utils';
import ListBlockedApps from '../components/LessonModule/ListBlockedApps';
import {
  addToLockedApps,
  blockApps,
  unBlockApps,
} from 'react-native-alphadex-screentime';
import {AppCategoryE} from 'src/core/domain/enums/AppCategoryE';
import ChildrenDescription, {
  ChildrenDescriptionRef,
} from '../components/ChildrenDescription';
import {useGetUserSetting} from 'src/hooks/useGetUserSetting';
import {ICabcBook, IClock, ICpurchase, ICsetting} from '../components/icons';
import Dropdown from 'src/core/components/dropdown/Dropdown';
import Toast from 'react-native-toast-message';
import {useSaveSetting} from 'src/hooks/useSaveSetting';
import {useSoundBackgroundGlobal} from 'src/core/presentation/hooks/sound/useSoundBackgroundGlobal';
import {useAuthParent} from 'src/hooks/useAuthParent';
import AuthParentScreen from './AuthParentScreen';
import PurchaseItem from '../components/LessonModule/PurchaseItem';
import ListAppBottomSheet from '../components/ListAppBlock/ListAppBottomSheet';
import Animated, {BounceIn, ReduceMotion} from 'react-native-reanimated';
import CheckSelect from 'src/core/components/checkSelect/CheckSelect';
import {IapContext} from 'src/core/presentation/store/iapContext';
import {TProduct} from 'src/core/presentation/store/iapProvider';

import DiamondContainer from './LessonComponent/DiamondContainer';
import {HomeProvider} from 'src/home/presentation/stores/HomeProvider';
import {HomeContext} from 'src/home/presentation/stores/HomeContext';
import {FieldData} from 'src/home/application/types/GetFieldResponse';
import {Subject} from 'src/home/application/types/GetListSubjectResponse';
import {BlockedModuleSetting} from 'src/lesson/application/types/UserSettingPayload';
import {GetListSubjectPayload} from 'src/home/application/types/GetListSubjectPayload';
import {Module} from 'src/home/application/types/GetListLessonResponse';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import ChangeLanguage from 'src/core/presentation/components/ChangeLanguage';
import {coreModuleContainer} from 'src/core/CoreModule';
import I18n from 'src/core/presentation/i18n';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import { FontFamily } from 'src/core/presentation/hooks/useFonts';

// ... existing imports ...

// =============================================================================
// CONSTANTS & ENUMS
// =============================================================================

enum TabSettingE {
  SOUND = 'Sound',
  BRIGHTNESS = 'Brightness',
  THEME = 'Theme',
}

const setingOptions = [
  {id: TabSettingE.SOUND, name: TabSettingE.SOUND, icon: IconListen},
  {
    id: TabSettingE.BRIGHTNESS,
    name: TabSettingE.BRIGHTNESS,
    icon: IconBrightness,
  },
  {id: TabSettingE.THEME, name: TabSettingE.THEME, icon: IconTheme},
];

const ParentScreen = observer(() => {
  const TabParentE = {
    APP_BLOCK: coreModuleContainer
      .getProvided(I18n)
      .t('lesson.screens.Parent.appBlock')
      .toString(),
    SETTING: coreModuleContainer
      .getProvided(I18n)
      .t('lesson.screens.Parent.setting'),
    PURCHASE: coreModuleContainer
      .getProvided(I18n)
      .t('lesson.screens.Parent.purchase'),
  };

  const tabsParent = [
    {id: TabParentE.APP_BLOCK, name: TabParentE.APP_BLOCK, icon: IClock},
    {id: TabParentE.SETTING, name: TabParentE.SETTING, icon: ICsetting},
    {id: TabParentE.PURCHASE, name: TabParentE.PURCHASE, icon: ICpurchase},
  ];

  // ---------------------------------------------------------------------------
  // State & Context
  // ---------------------------------------------------------------------------
  const insets = useSafeAreaInsets();
  const globalStyle = useGlobalStyle();
  const lesson = useLessonStore();
  const {handleGetModulesField, listModuleByField} = lesson;
  const {iapState, makePurchase} = useContext(IapContext);
  const {homeState, fetchListSubject} = useContext(HomeContext);

  // ---------------------------------------------------------------------------
  // Store & Context Hooks
  // ---------------------------------------------------------------------------
  const {
    userProfile,
    getUserProfile,
    selectedChild,
    setSelectedChild,
    deviceToken,
    deleteChildren,
    handleUserLogOut,
  } = useAuthenticationStore();
  const homeStore = useHomeStore();
  const {listSubject, rootSubject, showTutorial} = homeStore;
  const i18n = useI18n();

  const {isShowAuth: isAuthenSetting, changeIsShowAuth} = useAuthParent();
  const isShowAuth = __DEV__ ? false : isAuthenSetting;

  const loadingGlobal = useLoadingGlobal();
  useGetUserSetting(deviceToken, selectedChild?._id ?? '', lesson);

  // ---------------------------------------------------------------------------
  // Derived Values
  // ---------------------------------------------------------------------------
  const points = useMemo(() => [100, 75, 50], []);
  const listFields = useMemo(() => {
    return homeState.listField;
  }, [homeState.listField]);

  const hasDataServer = useMemo(
    () =>
      !!lesson.blockedListAppsSystem.length ||
      !!lesson.blockedAnonymousListAppsSystem?.applicationTokens?.length ||
      !!lesson.blockedAnonymousListAppsSystem?.categoryTokens?.length,
    [
      lesson.blockedAnonymousListAppsSystem?.applicationTokens?.length,
      lesson.blockedAnonymousListAppsSystem?.categoryTokens?.length,
      lesson.blockedListAppsSystem.length,
    ],
  );
  const blockOptions = useMemo(() => {
    if (isAndroid) {
      return (
        lesson.blockedListAppsSystem?.map(app => {
          return {
            id: app.package_name,
            name: app.app_name,
            icon: app.app_icon,
            token: app.package_name,
            category: AppCategoryE.APP,
          };
        }) ?? []
      );
    } else {
      if (lesson.blockedAnonymousListAppsSystem?.categoryTokens?.length) {
        return (
          lesson.blockedAnonymousListAppsSystem?.categoryTokens?.map(
            (app, i) => {
              return {
                id: 'app.package_name',
                name: `C ${i + 1}`,
                icon: 'no_icon',
                token: app.data,
                category: AppCategoryE.CATEGORY,
              };
            },
          ) ?? []
        );
      }
      return (
        lesson.blockedAnonymousListAppsSystem?.applicationTokens?.map(
          (app, i) => {
            return {
              id: 'app.package_name',
              name: `A ${i + 1}`,
              icon: 'no_icon',
              token: app.data,
              category: AppCategoryE.APP,
            };
          },
        ) ?? []
      );
    }
  }, [
    lesson.blockedAnonymousListAppsSystem?.applicationTokens,
    lesson.blockedAnonymousListAppsSystem?.categoryTokens,
    lesson.blockedListAppsSystem,
  ]);

  const purchaseOptions = useMemo(() => {
    return (
      listFields?.map(field => ({
        id: field._id,
        name: field.name,
        icon: <ICabcBook />,
        itemCardProps: {backgroundColor: COLORS.RED_E3643C},
      })) ?? []
    );
  }, [listFields]);

  const gradeObjs = useMemo(() => {
    return listSubject
      .filter(subject => subject.parentId === rootSubject?.fieldId)
      .sort((a, b) => a.level - b.level);
  }, [listSubject, rootSubject]);

  const dataPurchase = useMemo(
    () => [
      {title: 'Vietnamese', description: '10 more modules'},
      {title: 'English', description: '10 more modules'},
    ],
    [],
  );

  // ---------------------------------------------------------------------------
  // State & Context
  // ---------------------------------------------------------------------------
  const [selectedBlock, setSelectedBlock] = useState(
    blockOptions?.[0]?.name ?? '',
  );
  const [selectedSetting, setSelectedSetting] = useState(
    setingOptions[0]?.id ?? '',
  );
  const [selectedPurchase, setSelectedPurchase] = useState(
    purchaseOptions[0] ?? '',
  );
  const [tabParent, setTabparent] = useState(TabParentE.APP_BLOCK);
  // const [userProfile, setUserProfile] = useState<data>();
  const [isChooseChildren, setIsChooseChildren] = useState(
    selectedChild?._id || '',
  );
  const [subjectInSelectedPurchaseField, setSubjectInSelectedPurchaseField] =
    useState<Subject[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);

  const [point, setPoint] = useState(75);

  const soundHook = useSoundBackgroundGlobal();

  const {errorMessage, setErrorMessage, blocked, setBlocked} = useSaveSetting(
    hasDataServer,
    selectedChild?._id ?? '',
  );

  const [selectedField, setSelectedField] = useState<FieldData | undefined>();
  const [selectedModule, setSelectedModule] = useState<Module | undefined>();
  const [subjectsInField, setSubjectsInField] = useState<Subject[]>([]);

  const [backgroundSound, setBackgroundSound] = useState<number>(
    lesson.backgroundSound,
  );
  const [charSound, setCharSound] = useState<number>(lesson.charSound);

  const childDescriptionRef = useRef<ChildrenDescriptionRef>(null);

  const onAddChild = () => {
    resetNavigator(STACK_NAVIGATOR.AUTH_NAVIGATOR, {
      screen: STACK_NAVIGATOR.AUTH.REGISTER_CHILD_SCREEN,
    });
  };

  const onSelectChild = (item: children) => {
    setIsChooseChildren(item._id);
  };

  const onUseChild = () => {
    const selectedChildrenProfile = userProfile?.children.filter(
      (item: children) => item._id === isChooseChildren,
    )[0];
    if (selectedChildrenProfile) {
      setSelectedChild(selectedChildrenProfile);
      resetNavigator(STACK_NAVIGATOR.BOTTOM_TAB_SCREENS);
      setTimeout(() => {
        unBlockApps(selectedChildrenProfile._id);
      }, 1000);
    }
  };

  const handleGetUserProfile = useCallback(async () => {
    const res = await getUserProfile();
    if (res.data) {
      // setUserProfile(res.data);
    }
    return res.data;
  }, [getUserProfile]);

  const onDeleteChild = useCallback(async () => {
    await deleteChildren(isChooseChildren);
    const res = await handleGetUserProfile();
    const updateSelectedChildrenProfile = res.children[0];
    if (updateSelectedChildrenProfile) {
      setSelectedChild(updateSelectedChildrenProfile);
      onSelectChild(updateSelectedChildrenProfile);
    }
  }, [
    deleteChildren,
    handleGetUserProfile,
    isChooseChildren,
    setSelectedChild,
  ]);

  const onConfigUserSetting = useCallback(() => {
    // Tạo một mảng các module bị chặn, bao gồm các module hiện tại và module mới với phần trăm và ID module được chọn
    const modules: BlockedModuleSetting[] = [
      ...(lesson.blockedModules ?? []),
      {
        percent: point,
        moduleId: selectedModule?._id ?? '',
      },
    ];
    // Cập nhật cài đặt chặn ứng dụng với thông tin về trẻ em, token thiết bị, điểm, các module và các ứng dụng bị chặn
    lesson.updateAppBlock({
      childrenId: selectedChild?._id ?? '',
      deviceToken,
      point,
      modules,
      appBlocked: {
        // Nếu là Android, tạo danh sách các ứng dụng bị chặn với thông tin chi tiết
        android: isAndroid
          ? blockOptions.map(t => {
              return {
                category: t.category,
                id: t.id ?? '',
                name: t.name ?? '',
                token: t.token ?? '',
              };
            })
          : [],
        // Nếu không phải Android (iOS), tạo danh sách các ứng dụng bị chặn với thông tin chi tiết
        ios: !isAndroid
          ? blockOptions.map(t => {
              return {
                category: t.category,
                token: t.token ?? '',
              };
            })
          : [],
      },
    });
  }, [
    selectedModule?._id,
    lesson,
    selectedChild?._id,
    deviceToken,
    point,
    blockOptions,
  ]);

  const onUnlockApps = useCallback(async () => {
    try {
      if (selectedChild) {
        loadingGlobal.toggleLoading(true, 'unlocking');

        await Promise.all([
          unBlockApps(selectedChild?._id),
          lesson.updateAppBlock({
            childrenId: selectedChild?._id ?? '',
            deviceToken,
            point,
            modules: [],
            appBlocked: {
              android: [],
              ios: [],
            },
          }),
        ]);
        Toast.show({
          type: 'success',
          text1: i18n.t('lesson.screens.Parent.yourAppsHaveBeenUnlocked'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: i18n.t('lesson.screens.Parent.pleaseSelectChild'),
        });
      }
    } catch (error) {
      console.log('🛠 LOG: 🚀 --> ~ onPress={ ~ error:', error);
    } finally {
      lesson.changeBlockedAnonymousListAppSystem(undefined);
      lesson.resetListAppSystem();
      loadingGlobal.toggleLoading(false, 'unlocking');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n, lesson, selectedChild]);

  const onSaveSoundSetting = () => {
    lesson.setBackgroundSound(backgroundSound);
    lesson.setCharSound(charSound);
    Toast.show({
      type: 'success',
      text1: i18n.t('lesson.screens.Parent.saveVolumeSetting'),
    });
  };

  /**-----------------------
   * todo      TODO
   *  In the provided code, the blockApps function is being called inside the blockAppsSystem function using the await keyword. The blockAppsSystem function is defined using the useCallback hook, which is commonly used in React to memoize functions and optimize performance.

The blockAppsSystem function is an asynchronous function that awaits the result of the blockApps function call. It uses optional chaining (?.) and nullish coalescing (??) operators to handle the case where selectedChild?._id is null or undefined. If selectedChild?._id is truthy, it will be passed as an argument to the blockApps function. Otherwise, an empty string will be passed.
   *
   *------------------------**/
  const blockAppsSystem = useCallback(async () => {
    try {
      if (isAndroid) {
        loadingGlobal.toggleLoading(true, 'blocking');
        setTimeout(() => {
          loadingGlobal.toggleLoading(false, 'blocking');
        }, 5000);
        await addToLockedApps(
          lesson.blockedListAppsSystem.map(v => ({
            app_name: v.app_name ?? '',
            package_name: v.package_name ?? '',
            file_path: v.apk_file_path ?? '',
          })),
        );
      } else {
        await blockApps(selectedChild?._id ?? '');
      }
      Toast.show({
        type: 'success',
        text1: i18n.t('lesson.screens.Parent.selectedAppsHasBeenBlocked'),
      });
    } catch (error) {
      console.log('🛠 LOG: 🚀 --> ~ blockAppsSystem ~ error:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n, lesson.blockedListAppsSystem, selectedChild?._id]);

  const listTabOptions = useMemo(() => {
    switch (tabParent) {
      case TabParentE.APP_BLOCK:
        return blockOptions;
      case TabParentE.SETTING:
        return setingOptions;
      case TabParentE.PURCHASE:
        return purchaseOptions;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParent, blockOptions]);

  const selectedOption = useMemo(() => {
    switch (tabParent) {
      case TabParentE.APP_BLOCK:
        return selectedBlock;
      case TabParentE.SETTING:
        return selectedSetting;
      case TabParentE.PURCHASE:
        return selectedPurchase;
    }
  }, [
    tabParent,
    TabParentE.APP_BLOCK,
    TabParentE.SETTING,
    TabParentE.PURCHASE,
    selectedBlock,
    selectedSetting,
    selectedPurchase,
  ]);

  const setSelectedOption = useCallback(
    (id: string) => {
      switch (tabParent) {
        case TabParentE.APP_BLOCK:
          setSelectedBlock(id);
          break;
        case TabParentE.SETTING:
          setSelectedSetting(id as TabSettingE);
          break;
        case TabParentE.PURCHASE:
          const selectedItem = purchaseOptions.find(item => item.name === id);
          selectedItem && setSelectedPurchase(selectedItem);
          break;
      }
    },
    [
      TabParentE.APP_BLOCK,
      TabParentE.PURCHASE,
      TabParentE.SETTING,
      purchaseOptions,
      tabParent,
    ],
  );

  const onPurchaseModule = (item: Subject) => {
    // if (iapState?.products) {
    //   makePurchase?.(iapState?.products?.[0]?.productId);
    // }
    pushScreen(STACK_NAVIGATOR.PARENT.MORE_MODULE_SCREEN, {
      subject: item,
      userProfile: userProfile,
    });
  };

  const onBuyDiamond = (item: TProduct) => {
    makePurchase?.(item.productId);
  };

  const handleGetSubject = useCallback(
    (subjectId: string) => {
      return subjectsInField.find(subject => subject._id === subjectId);
    },
    [subjectsInField],
  );

  const handleSelectedSubject = useCallback(
    (field: GetListSubjectPayload) => {
      fetchListSubject({_id: field.fieldId} as any).then(v => {
        setSubjectsInField(v ?? []);
      });

      handleGetModulesField(field).then(v => {
        setPoint(p => lesson.blockedModules?.[0]?.percent ?? p);
        setSelectedModule(v.data?.[0]);
      });
    },
    [fetchListSubject, handleGetModulesField, lesson.blockedModules],
  );

  const handleGetListSubjectInField = useCallback(
    (field: GetListSubjectPayload) => {
      fetchListSubject({_id: field.fieldId} as any).then(v => {
        setSubjectInSelectedPurchaseField(v ?? []);
      });
    },
    [fetchListSubject],
  );

  // ---------------------------------------------------------------------------
  // Effects & Data Fetching
  // ---------------------------------------------------------------------------
  useEffect(() => {
    handleGetUserProfile();
  }, [handleGetUserProfile]);

  useEffect(() => {
    if (iapState.isPurchaseSuccess) {
      handleGetUserProfile();
    }
  }, [handleGetUserProfile, iapState.isPurchaseSuccess]);

  useAsyncEffect(async () => {
    if (isAndroid) {
      lesson.changeListAppSystem();
    }
  }, []);

  useEffect(() => {
    setSelectedOption(listTabOptions?.[0]?.name ?? '');
  }, [setSelectedOption, listTabOptions]);

  useEffect(() => {
    if (lesson.unlockPercent > 0) {
      setPoint(lesson.unlockPercent);
    }
  }, [lesson.unlockPercent]);

  useEffect(() => {
    setSelectedField(listFields?.[0]);
    listFields?.[0]?._id &&
      handleSelectedSubject({fieldId: listFields?.[0]?._id});
  }, [listFields, handleSelectedSubject]);

  useEffect(() => {
    handleGetListSubjectInField({fieldId: selectedPurchase.id});
  }, [handleGetListSubjectInField, selectedPurchase.id]);

  useEffect(() => {
    if (showTutorial) {
      pushScreen(STACK_NAVIGATOR.TUTORIAL_NAVIGATOR, {});
    }
  }, [showTutorial]);
  useEffect(() => {
    if (homeStore.isGotoBuyModule) {
      setTabparent(TabParentE.PURCHASE);
      setSelectedOption(listTabOptions?.[0]?.name ?? '');
      homeStore.setIsGotoBuyModule(false);
    }
  }, [
    TabParentE.PURCHASE,
    homeStore,
    homeStore.isGotoBuyModule,
    listTabOptions,
    setSelectedOption,
  ]);

  const _buildBlockView = () => {
    return (
      <>
        <View style={[styles.bodyBook]}>
          <Text style={[globalStyle.txtLabel, styles.txtTitleBook]}>
            {tabParent}
          </Text>

          <ListBlockedApps
            setTabBody={setSelectedOption}
            selectedApp={
              typeof selectedOption === 'string'
                ? selectedOption
                : selectedOption?.name ?? ''
            }
            listApp={listTabOptions}
          />
        </View>
        <View style={[styles.bodyContent, styles.rowBetween]}>
          <View style={[styles.rowBetween]}>
            <View style={[styles.fill, styles.rowBetween]}>
              <View style={[styles.fill, {zIndex: 999}]}>
                <View style={[{zIndex: 999}]}>
                  <Text style={[globalStyle.txtButton, styles.textColor]}>
                    {i18n.t('lesson.screens.Parent.appToLock')}
                  </Text>

                  {selectedChild && (
                    <SelectApp
                      appName={
                         typeof selectedOption === 'string'
                          ? selectedOption
                          : 'select apps'
                      }
                      error={errorMessage}
                      childrenId={selectedChild?._id}
                      onBlocked={() => {
                        setErrorMessage('');
                        setBlocked(true);
                      }}
                    />
                  )}
                </View>
                <Dropdown
                  data={listFields ?? []}
                  title={selectedField?.name ?? listFields?.[0]?.name ?? ''}
                  onSelectItem={item => {
                    setSelectedField(item);
                    handleSelectedSubject({fieldId: item._id});
                  }}
                  width={scale(100)}
                  nameIndex="name"
                />
              </View>
              <View style={[styles.fill]}>
                <TouchableOpacity activeOpacity={1}>
                  <Text style={[globalStyle.txtButton, styles.textColor]}>
                    {i18n.t('lesson.screens.Parent.scoreToUnlock')}
                  </Text>
                </TouchableOpacity>
                <View style={{zIndex: 999}}>
                  <Dropdown
                    data={points}
                    title={point.toString()}
                    onSelectItem={item => setPoint(+item)}
                    prefix="%"
                  />
                </View>

                <View style={{height: verticalScale(30)}} />

                <View style={{zIndex: 998}}>
                  <Dropdown
                    data={listModuleByField ?? []}
                    title={selectedModule?.name ?? listModuleByField?.[0]?.name}
                    onSelectItem={item => {
                      setSelectedModule(item);
                    }}
                    // titleItem={}
                    getTitleItem={handleGetSubject}
                    width={scale(100)}
                    nameIndex="name"
                  />
                </View>
              </View>
            </View>
            <View>
              <View style={[styles.fill]} />
              <PrimaryButton
                onPress={onConfigUserSetting}
                text={i18n.t('lesson.screens.Parent.save')}
                style={[styles.btnCommon]}
                isLoading={lesson.isLoadingUserSetting}
                disable={!!errorMessage}
              />
              <PrimaryButton
                text={i18n.t('lesson.screens.Parent.unlock')}
                style={[styles.btnCommon, styles.btnRed]}
                onPress={onUnlockApps}
              />
              {!isShowAuth && (
                <Animated.View
                  entering={BounceIn.duration(500)
                    .delay(500)
                    .reduceMotion(ReduceMotion.Never)}>
                  <PrimaryButton
                    onPress={blockAppsSystem}
                    text={i18n.t('lesson.screens.Parent.lockApps')}
                    style={[styles.btnCommon]}
                    disable={!!errorMessage}
                  />
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </>
    );
  };

  const _buildSettingView = () => {
    return (
      <View style={[styles.bodySetting]}>
        <Text style={[globalStyle.txtLabel, styles.txtTitleBlue]}>
          {tabParent}
        </Text>
        <View style={styles.rowBetween}>
          <View style={[styles.rowBetween]}>
            <View style={[styles.fill, styles.mr16]}>
              <Text style={[globalStyle.txtButton, styles.textColor]}>
                {i18n.t('lesson.screens.Parent.backgroundSound')}
              </Text>
              <View style={[styles.mb12, styles.mt4]}>
                <Volume
                  value={backgroundSound * 100}
                  onChangValue={v => {
                    const newVolume = (v / 100).toFixed(1);
                    setBackgroundSound(Number(newVolume));
                    soundHook.setVolume(+newVolume);
                  }}
                />
              </View>

              <Text style={[globalStyle.txtButton, styles.textColor]}>
                {i18n.t('lesson.screens.Parent.characterSound')}
              </Text>
              <View style={[styles.mb12, styles.mt4]}>
                <Volume
                  value={charSound * 100}
                  onChangValue={async v => {
                    const newVolume = (v / 100).toFixed(1);
                    setCharSound(Number(newVolume));
                    soundHook.setVolume(+newVolume);
                  }}
                />
              </View>
              <View style={[styles.rowBetween]}>
                <Text style={[globalStyle.txtButton, styles.textColor]}>
                  {i18n.t('lesson.screens.Parent.mode')}
                </Text>
                <CheckSelect name={i18n.t('lesson.screens.Parent.light')} />
                <CheckSelect
                  name={i18n.t('lesson.screens.Parent.dark')}
                  isSelected
                />
              </View>
              <View style={[styles.rowBetween, styles.mt16]}>
                <Text style={[globalStyle.txtButton, styles.textColor]}>
                  {i18n.t('lesson.screens.Parent.language')}
                </Text>
                {/* <CheckSelect name="English" isSelected />
                <CheckSelect
                  onPress={() => {
                    i18n.changeLanguage('en');
                  }}
                  name="Vietnam"
                /> */}
                <ChangeLanguage />
              </View>
            </View>
            <View>
              <View style={[styles.fill]} />
              <PrimaryButton
                text={i18n.t('lesson.screens.Parent.setAsDefault')}
                style={[styles.btnCommon, styles.round, styles.btnOrange]}
              />
              <PrimaryButton
                text={i18n.t('lesson.screens.Parent.save')}
                style={[styles.btnCommon, styles.round]}
                onPress={onSaveSoundSetting}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const _buildPurchaseView = () => {
    return (
      <>
        <View style={[styles.bodyBook]}>
          <Text style={[globalStyle.txtLabel, styles.txtTitleBook]}>
            {tabParent}
          </Text>

          <ListBlockedApps
            setTabBody={setSelectedOption}
            selectedApp={
              typeof selectedOption === 'string'
                ? selectedOption
                : selectedOption?.name ?? ''
            }
            listApp={listTabOptions}
          />
        </View>
        <View style={[styles.bodyContent, styles.rowBetween]}>
          <View style={[styles.fill]}>
            {subjectInSelectedPurchaseField
              .sort((a, b) => a.level - b.level)
              .slice(0, showAll ? undefined : 5)
              .map((item, i) => {
                if (item.type === 'child') {
                  return (
                    <PurchaseItem
                      key={i}
                      isBorderTop={i !== 0}
                      title={item.name}
                      description={item.description}
                      icon={item.image}
                      onPress={() => onPurchaseModule(item)}
                    />
                  );
                }
              })}
            {subjectInSelectedPurchaseField.length > 5 && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowAll(!showAll)}>
                <Text style={[globalStyle.txtButton, styles.textColor]}>
                  {showAll
                    ? i18n.t('lesson.screens.Parent.showLess')
                    : i18n.t('lesson.screens.Parent.showMore')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <DiamondContainer onBuyDiamond={onBuyDiamond} />
      </>
    );
  };
  const buildPage = () => {
    switch (tabParent) {
      case TabParentE.APP_BLOCK:
        return _buildBlockView();
      case TabParentE.SETTING:
        return _buildSettingView();
      case TabParentE.PURCHASE:
        return _buildPurchaseView();
    }
  };

  return (
    <View style={[styles.fill, styles.bg, {paddingTop: insets.top}]}>
      <View style={[styles.head]}>
        <View style={[styles.rowBetween]}>
          <AccountStatus
            isShowLogout={true}
            isShowDiamond={true}
            diamond={userProfile?.diamond ?? 0}
          />
        </View>
        <View style={[styles.profile_border]}>
          <View style={[styles.profile]}>
            <IconUser width={70} height={70} />
          </View>
        </View>
        <Username />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : undefined}
        style={styles.fill}
        contentContainerStyle={styles.fill}>
        <BookView style={[styles.mt16, styles.fill]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.bookContent]}>
            <View style={[styles.rowBetween, styles.ph16]}>
              {tabsParent.map(t => (
                <ItemCard
                  key={t.id}
                  name={t.name}
                  Icon={t.icon}
                  isHexagon={true}
                  backgroundColor="#f9cc2d"
                  backgroundFocusColor="#66c270"
                  isFocus={tabParent === t.id}
                  onPress={() => setTabparent(t.id)}
                />
              ))}
            </View>
            <View style={{zIndex: 999}}>{buildPage()}</View>
            <View style={[styles.bodyBookTwo]}>
              <Text style={[globalStyle.txtLabel, styles.txtTitleBookTwo]}>
                {i18n.t('lesson.screens.Parent.childrenAccountsList')}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.wrapAddChildContainer}>
                  {userProfile?.children.map((item: children) => {
                    return (
                      <View
                        style={{alignItems: 'center', marginRight: scale(8)}}>
                        <TouchableOpacity
                          style={styles.addChildContainer}
                          onPress={() => onSelectChild(item)}>
                          <View
                            style={[
                              styles.addChildContent,
                              isChooseChildren === item._id
                                ? {backgroundColor: COLORS.GREEN_66C270}
                                : {},
                            ]}>
                            <ICManIconMedium
                              color={
                                isChooseChildren === item._id
                                  ? COLORS.WHITE
                                  : COLORS.BLUE_1C6349
                              }
                            />
                          </View>
                        </TouchableOpacity>
                        <Text style={styles.childrenName}>{item.name}</Text>
                      </View>
                    );
                  })}
                </View>
                {userProfile?.children && userProfile?.children.length < 5 && (
                  <View style={styles.wrapAddChildContainer}>
                    <View style={{alignItems: 'center'}}>
                      <TouchableOpacity
                        style={styles.addChildContainer}
                        onPress={onAddChild}>
                        <ICAddChild />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
            <View style={[styles.bodyContent, styles.rowBetween]}>
              <ChildrenDescription ref={childDescriptionRef} />
              <View>
                <View style={[styles.fill]} />
                <PrimaryButton
                  onPress={() =>
                    childDescriptionRef.current?.onChangeName?.(
                      childDescriptionRef.current.childDescription,
                    )
                  }
                  text={i18n.t('lesson.screens.Parent.save')}
                  style={[styles.btnCommon]}
                />
                <PrimaryButton
                  text={i18n.t('lesson.screens.Parent.delete')}
                  style={[styles.btnCommon, styles.btnRed]}
                  onPress={onDeleteChild}
                  disable={(userProfile?.children.length || 0) < 2}
                />
              </View>
            </View>
            <TouchableOpacity onPress={handleUserLogOut} style={[styles.logoutContainer]}>
              <Text style={[globalStyle.txtNote, styles.btnLogout]}>
                {i18n.t('authentication.screens.ListChildren.logout')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </BookView>
      </KeyboardAvoidingView>
      {isShowAuth && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 999,
            width: WIDTH_SCREEN,
            height: HEIGHT_SCREEN,
            backgroundColor: 'red',
          }}>
          <AuthParentScreen changeIsShowAuth={changeIsShowAuth} />
        </View>
      )}
      {isAndroid && <ListAppBottomSheet />}
    </View>
  );
});

export default withProviders(LessonStoreProvider, HomeProvider)(ParentScreen);

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  bg: {
    backgroundColor: COLORS.WHITE_FBF8CC,
  },
  btnLogout: {
    padding: verticalScale(10),
    alignItems: 'center',
    fontSize: scale(16),
    color: COLORS.RED_F28759,
    textDecorationLine: 'underline',
    fontFamily: FontFamily.Eina01Bold
  },
  txtLogout: {
    color: '#1C6349',
    paddingLeft: 8,
  },
  rowHCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile_border: {
    height: 120,
    width: 120,
    backgroundColor: COLORS.YELLOW_F2B559,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 60,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.YELLOW_FFE699,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  head: {
    paddingHorizontal: scale(16),
    alignItems: 'center',
  },
  textColor: {
    color: COLORS.BLUE_1C6349,
  },
  txtParentName: {
    color: COLORS.BLUE_1C6349,
    marginRight: 12,
  },

  ph16: {
    paddingHorizontal: scale(16),
  },
  mb12: {
    marginBottom: scale(12),
  },
  mt4: {
    marginTop: scale(4),
  },
  mt16: {
    paddingTop: scale(16),
  },
  mr16: {
    marginRight: scale(16),
  },
  mr32: {
    marginRight: scale(32),
  },
  arrowLeft: {
    marginRight: scale(8),
  },
  arrowRight: {
    marginLeft: scale(8),
  },
  bookContent: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(54),
  },
  bodyBook: {
    borderRadius: 30,
    backgroundColor: '#78C5B4',
    paddingVertical: 20,
    paddingHorizontal: 8,
    marginTop: 32,
    zIndex: 50,
  },
  bodyBookTwo: {
    borderRadius: 30,
    backgroundColor: '#FFE287',
    paddingVertical: 24,
    paddingHorizontal: 8,
    marginTop: 32,
    zIndex: 50,
  },
  txtTitleBook: {
    color: '#FBF8CC',
    marginBottom: 16,
    marginLeft: 16,
  },
  txtTitleBlue: {
    color: '#78C5B4',
    marginBottom: 16,
  },
  txtTitleBookTwo: {
    color: '#1C6349',
    marginBottom: 16,
    marginLeft: 16,
  },
  bodyContent: {
    marginTop: -50,
    paddingTop: 66,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FBF8CC',
  },
  bodySetting: {
    marginTop: 32,
    paddingTop: 16,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FBF8CC',
  },
  btnCommon: {
    width: 80,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  round: {
    borderRadius: 300,
    width: scale(90),
  },
  btnOrange: {
    backgroundColor: COLORS.YELLOW_F2B559,
  },
  btnRed: {
    backgroundColor: COLORS.RED_F28759,
  },
  card: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: verticalScale(8),
    borderRadius: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.YELLOW_FFE699,
    marginTop: verticalScale(6),
    marginBottom: verticalScale(12),
    marginRight: scale(8),
  },
  textCard: {
    color: COLORS.BLUE_1C6349,
    marginRight: 4,
  },
  wrapAddChildContainer: {
    flexDirection: 'row',
    marginTop: scale(16),
  },
  addChildContainer: {
    height: scale(88),
    width: scale(88),
    backgroundColor: COLORS.YELLOW_F2B559,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(8),
  },
  addChildContent: {
    height: scale(80),
    width: scale(80),
    backgroundColor: COLORS.WHITE_FBF8CC,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(8),
  },
  childrenName: {
    ...CustomTextStyle.caption,
    color: COLORS.BLUE_1C6349,
    marginTop: scale(4),
  },
  dropdown: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    paddingBottom: 10,
    paddingTop: 20,
    paddingHorizontal: 10,
    top: 40,
    position: 'absolute',
    zIndex: -1,
    width: scale(70),
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  option: {
    paddingVertical: verticalScale(6),
    color: COLORS.GREEN_1C6349,
  },
  wrapDiamondPurchaseContainer: {
    marginTop: 16,
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: 32,
  },
  diamondPurchaseContainer: {
    backgroundColor: COLORS.BLUE_78C5B4,
    borderRadius: 32,
    padding: 16,
  },
  purchaseHeaderTitle: {
    fontSize: 16,
    color: COLORS.WHITE_FBF8CC,
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitBold,
  },
  wrapDiamondPurchaseContentContainer: {
    padding: 16,
  },
  showMoreButton: {
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  logoutContainer: {
    alignItems: 'center',
    marginVertical: verticalScale(24),
  }
});
