import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import IconUser from 'assets/svg/IconUser';
import PrimaryButton from '../components/PrimaryButton';
import IconArrowDown from 'assets/svg/IconArrowDown';
import IconArrowUp from 'assets/svg/IconArrowUp';
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
import {
  children,
  data,
} from 'src/authentication/application/types/GetUserProfileResponse';
import ICAddChild from 'src/core/components/icons/ICAddChild';
import {COLORS} from 'src/core/presentation/constants/colors';
import ICManIconMedium from 'src/core/components/icons/ICManIconMedium';
import {s, scale, verticalScale} from 'react-native-size-matters';
import {resetNavigator} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import AccountStatus from 'src/home/presentation/components/AccountStatus';
import Username from '../components/Username';
import {useAsyncEffect} from 'src/core/presentation/hooks';
import SelectApp from '../components/LessonModule/SelectApp';
import {
  HEIGHT_SCREEN,
  isAndroid,
  WIDTH_SCREEN,
} from 'src/core/presentation/utils';
import {assets} from 'src/core/presentation/utils';
import ListBlockedApps from '../components/LessonModule/ListBlockedApps';
import {
  addToLockedApps,
  blockApps,
  unBlockApps,
} from 'react-native-alphadex-screentime';
import {AppCategoryE} from 'src/core/domain/enums/AppCategoryE';
import ChildrenDescription from '../components/ChildrenDescription';
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
import {VolumeManager} from 'react-native-volume-manager';

enum TabParentE {
  APP_BLOCK = 'App block',
  SETTING = 'Setting',
  PURCHASE = 'Purchase',
}

enum TabSettingE {
  SOUND = 'Sound',
  BRIGHTNESS = 'Brightness',
  THEME = 'Theme',
}

const tabsParent = [
  {id: TabParentE.APP_BLOCK, name: TabParentE.APP_BLOCK, icon: IClock},
  {id: TabParentE.SETTING, name: TabParentE.SETTING, icon: ICsetting},
  {id: TabParentE.PURCHASE, name: TabParentE.PURCHASE, icon: ICpurchase},
];

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
  const insets = useSafeAreaInsets();
  const globalStyle = useGlobalStyle();
  const lesson = useLessonStore();
  const soundHook = useSoundBackgroundGlobal();

  const {
    getUserProfile,
    selectedChild,
    setSelectedChild,
    deviceToken,
    deleteChildren,
  } = useAuthenticationStore();

  useGetUserSetting(deviceToken, selectedChild?._id ?? '', lesson);
  const {isShowAuth, changeIsShowAuth} = useAuthParent();
  console.log(
    '🛠 LOG: 🚀 --> ----------------------------------------🛠 LOG: 🚀 -->',
  );
  console.log('🛠 LOG: 🚀 --> ~ isShowAuth:', isShowAuth);
  console.log(
    '🛠 LOG: 🚀 --> ----------------------------------------🛠 LOG: 🚀 -->',
  );
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

  const {errorMessage, setErrorMessage, blocked, setBlocked} = useSaveSetting(
    hasDataServer,
    selectedChild?._id ?? '',
  );
  const hasSaving = useMemo(() => {
    return blocked && errorMessage === '';
  }, [blocked, errorMessage]);

  const [tabParent, setTabparent] = useState(TabParentE.APP_BLOCK);

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

  console.log(
    '🛠 LOG: 🚀 --> --------------------------------------------------🛠 LOG: 🚀 -->',
  );
  console.log('🛠 LOG: 🚀 --> ~ tabsBlock ~ tabsBlock:', blockOptions);
  console.log(
    '🛠 LOG: 🚀 --> --------------------------------------------------🛠 LOG: 🚀 -->',
  );

  const purchaseOptions = [
    {
      id: '4',
      name: 'Language',
      icon: <ICabcBook />,
      itemCardProps: {backgroundColor: '#EFC73A'},
    },
    {
      id: '5',
      name: 'Science',
      icon: <ICabcBook />,
      itemCardProps: {backgroundColor: '#EF9D23'},
    },
    {
      id: '6',
      name: 'Mathematics',
      icon: <ICabcBook />,
      itemCardProps: {backgroundColor: '#E3643C'},
    },
  ];

  const dataPurchase = useMemo(
    () => [
      {title: 'Vietnamese', description: '10 more modules'},
      {title: 'English', description: '10 more modules'},
    ],
    [],
  );

  const [selectedBlock, setSelectedBlock] = useState<string>(
    blockOptions?.[0]?.name ?? '',
  );

  const [selectedSetting, setSelectedSetting] = useState<string>(
    setingOptions[0]?.id ?? '',
  );

  const [selectedPurchase, setSelectedPurchase] = useState<string>(
    purchaseOptions[0]?.id ?? '',
  );
  const [userProfile, setUserProfile] = useState<data>();
  const [isChooseChildren, setIsChooseChildren] = useState<string>(
    selectedChild?._id || '',
  );
  const [isShowLimitOption, setIsShowLimitOption] = useState(false);
  const points = useMemo(() => [100, 75, 50], []);
  const [point, setPoint] = useState(75);
  const [backgroundSound, setBackgroundSound] = useState<number>(
    lesson.backgroundSound,
  );
  const [charSound, setCharSound] = useState<number>(lesson.charSound);

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
      setUserProfile(res.data);
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
    lesson.updateAppBlock({
      childrenId: selectedChild?._id ?? '',
      deviceToken,
      point,
      appBlocked: {
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
  }, [deviceToken, lesson, point, selectedChild?._id, blockOptions]);

  const onSaveSoundSetting = () => {
    lesson.setBackgroundSound(backgroundSound);
    lesson.setCharSound(charSound);
    Toast.show({
      type: 'success',
      text1: 'Save volume settings!',
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
        text1: 'Selected apps has been blocked!',
      });
    } catch (error) {}
  }, [lesson.blockedListAppsSystem, selectedChild?._id]);

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
  }, [selectedBlock, tabParent, selectedPurchase, selectedSetting]);

  const setSelectedOption = useCallback(
    (id: string) => {
      switch (tabParent) {
        case TabParentE.APP_BLOCK:
          setSelectedBlock(id);
          break;
        case TabParentE.SETTING:
          setSelectedSetting(id);
          break;
        case TabParentE.PURCHASE:
          setSelectedPurchase(id);
          break;
      }
    },
    [tabParent],
  );

  useEffect(() => {
    handleGetUserProfile();
  }, [handleGetUserProfile]);

  // useAsyncEffect(async () => {
  //   if (isAndroid) {
  //     try {
  //       await lesson.changeListAppSystem();
  //     } catch (error) {
  //     } finally {
  //     }
  //   }
  // }, []);

  useEffect(() => {
    setSelectedOption(listTabOptions?.[0]?.name ?? '');
  }, [setSelectedOption, listTabOptions]);

  useEffect(() => {
    if (lesson.unlockPercent > 0) {
      setPoint(lesson.unlockPercent);
    }
  }, [lesson.unlockPercent]);

  const _buildBlockView = () => {
    return (
      <>
        <View style={[styles.bodyBook]}>
          <Text style={[globalStyle.txtLabel, styles.txtTitleBook]}>
            {tabParent}
          </Text>

          <ListBlockedApps
            setTabBody={setSelectedOption}
            selectedApp={selectedOption}
            listApp={listTabOptions}
          />
        </View>
        <View style={[styles.bodyContent, styles.rowBetween]}>
          <View style={[styles.rowBetween]}>
            <View style={[styles.fill, styles.rowBetween]}>
              <View style={[styles.fill, {zIndex: 999}]}>
                <View style={[{zIndex: 999}]}>
                  <Text style={[globalStyle.txtButton, styles.textColor]}>
                    App to lock
                  </Text>

                  {selectedChild && (
                    <SelectApp
                      appName={
                        selectedOption.trim() !== ''
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
                {/* <View style={[]}>
                <Text style={[globalStyle.txtButton, styles.textColor]}>
                  Lessons to unlock
                </Text>
                <View style={[styles.card]}>
                  <Text
                    allowFontScaling
                    style={[globalStyle.txtButton, styles.textCard]}>
                    Vietnamese
                  </Text>
                  <IconArrowDown />
                </View>
              </View> */}
              </View>
              <View style={[styles.fill]}>
                <TouchableOpacity
                  onPress={() => {
                    setIsShowLimitOption(v => !v);
                  }}
                  activeOpacity={1}>
                  <Text style={[globalStyle.txtButton, styles.textColor]}>
                    Score to unlock
                  </Text>
                </TouchableOpacity>
                <Dropdown
                  data={points}
                  title={point.toString()}
                  onSelectItem={item => setPoint(+item)}
                  prefix="%"
                />

                {/* <View style={[{zIndex: -2}]}>
                  <Text style={[globalStyle.txtButton, styles.textColor]}>
                    Your unlock score
                  </Text>
                  <View style={[styles.card, {opacity: 0.6}]}>
                    <Text style={[globalStyle.txtButton, styles.textCard]}>
                      {point}%
                    </Text>
                    {isShowLimitOption ? <IconArrowUp /> : <IconArrowDown />}
                  </View>
                </View> */}
              </View>
            </View>
            <View>
              <View style={[styles.fill]} />
              <PrimaryButton
                onPress={onConfigUserSetting}
                text={'Save'}
                style={[styles.btnCommon]}
                isLoading={lesson.isLoadingUserSetting}
                disable={!!errorMessage}
              />
              <PrimaryButton
                text="Unlock"
                style={[styles.btnCommon, styles.btnRed]}
                onPress={async () => {
                  try {
                    if (selectedChild) {
                      await unBlockApps(selectedChild?._id);
                      Toast.show({
                        type: 'success',
                        text1: 'Your apps have been unlocked',
                      });
                    } else {
                      Toast.show({
                        type: 'error',
                        text1: 'Please select a child',
                      });
                    }
                  } catch (error) {
                    console.log('🛠 LOG: 🚀 --> ~ onPress={ ~ error:', error);
                  } finally {
                    lesson.changeBlockedAnonymousListAppSystem(undefined);
                    lesson.resetListAppSystem();
                  }
                }}
              />
              {!isShowAuth && (
                <Animated.View
                  entering={BounceIn.duration(500)
                    .delay(500)
                    .reduceMotion(ReduceMotion.Never)}>
                  <PrimaryButton
                    onPress={blockAppsSystem}
                    text={'Lock apps'}
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
                Background sound
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
                Character sound
              </Text>
              <View style={[styles.mb12, styles.mt4]}>
                <Volume
                  value={charSound * 100}
                  onChangValue={async v => {
                    const newVolume = (v / 100).toFixed(1);
                    setCharSound(Number(newVolume));
                  }}
                />
              </View>
              <View style={[styles.rowBetween]}>
                <Text style={[globalStyle.txtButton, styles.textColor]}>
                  Mode
                </Text>
                <CheckSelect name="Light" />
                <CheckSelect name="Dark" isSelected />
              </View>
              <View style={[styles.rowBetween, styles.mt16]}>
                <Text style={[globalStyle.txtButton, styles.textColor]}>
                  Language
                </Text>
                <CheckSelect name="English" isSelected />
                <CheckSelect name="Vietnam" />
              </View>
            </View>
            <View>
              <View style={[styles.fill]} />
              <PrimaryButton
                text="Set as default"
                style={[styles.btnCommon, styles.round, styles.btnOrange]}
              />
              <PrimaryButton
                text="Save"
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
            selectedApp={selectedOption}
            listApp={listTabOptions}
          />
        </View>
        <View style={[styles.bodyContent, styles.rowBetween]}>
          <View style={[styles.fill]}>
            {dataPurchase.map((item, i) => (
              <PurchaseItem
                key={i}
                isBorderTop={i !== 0}
                title={item.title}
                description={item.description}
                icon={assets.book}
              />
            ))}
          </View>
        </View>
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
          <AccountStatus isShowLogout={true} />
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
            {buildPage()}
            <View style={[styles.bodyBookTwo]}>
              <Text style={[globalStyle.txtLabel, styles.txtTitleBookTwo]}>
                Children accounts list
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
              <ChildrenDescription />
              <View>
                <View style={[styles.fill]} />
                <PrimaryButton
                  text="Use"
                  style={[styles.btnCommon]}
                  onPress={onUseChild}
                />
                <PrimaryButton
                  text="Delete"
                  style={[styles.btnCommon, styles.btnRed]}
                  onPress={onDeleteChild}
                  disable={(userProfile?.children.length || 0) < 2}
                />
              </View>
            </View>
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

export default withProviders(LessonStoreProvider)(ParentScreen);

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  bg: {
    backgroundColor: '#fbf8cc',
  },
  btnLogout: {
    backgroundColor: '#66C270',
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    borderRadius: 50,
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
    backgroundColor: '#F2B559',
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
    backgroundColor: '#FFE699',
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
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  textColor: {
    color: '#1C6349',
  },
  txtParentName: {
    color: '#1C6349',
    marginRight: 12,
  },
  pt16: {
    paddingTop: 16,
  },
  ph16: {
    paddingHorizontal: 16,
  },
  mb12: {
    marginBottom: 12,
  },
  mt4: {
    marginTop: 4,
  },
  mt16: {
    marginTop: 16,
  },
  mr16: {
    marginRight: 16,
  },
  mr32: {
    marginRight: 32,
  },
  arrowLeft: {
    marginRight: 8,
  },
  arrowRight: {
    marginLeft: 8,
  },
  bookContent: {
    paddingHorizontal: 16,
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
    backgroundColor: '#F2B559',
  },
  btnRed: {
    backgroundColor: '#F28759',
  },
  card: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: verticalScale(8),
    borderRadius: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFE699',
    marginTop: verticalScale(6),
    marginBottom: verticalScale(12),
    marginRight: scale(8),
  },
  textCard: {
    color: '#1C6349',
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
    shadowColor: '#000',
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
});
