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
import IconLock from 'assets/svg/IconLock';
import IconSetting from 'assets/svg/IconSetting';
import IconPurchase from 'assets/svg/IconPurchase';
import PrimaryButton from '../components/PrimaryButton';
import IconArrowDown from 'assets/svg/IconArrowDown';
import IconArrowUp from 'assets/svg/IconArrowUp';
import ItemCard from '../components/ItemCard';
import IconListen from 'assets/svg/IconListen';
import IconBrightness from 'assets/svg/IconBrightness';
import IconTheme from 'assets/svg/IconTheme';
import IconDiamond from 'assets/svg/IconDiamond';
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
import {scale, verticalScale} from 'react-native-size-matters';
import {resetNavigator} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import AccountStatus from 'src/home/presentation/components/AccountStatus';
import Username from '../components/Username';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {useAsyncEffect} from 'src/core/presentation/hooks';
import SelectApp from '../components/LessonModule/SelectApp';
import {isAndroid} from 'src/core/presentation/utils';
import ListBlockedApps from '../components/LessonModule/ListBlockedApps';
import {unBlockApps} from 'react-native-alphadex-screentime';
import {AppCategoryE} from 'src/core/domain/enums/AppCategoryE';
import ChildrenDescription from '../components/ChildrenDescription';

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

const tabsData = [
  {id: TabParentE.APP_BLOCK, name: TabParentE.APP_BLOCK, icon: IconLock},
  {id: TabParentE.SETTING, name: TabParentE.SETTING, icon: IconSetting},
  {id: TabParentE.PURCHASE, name: TabParentE.PURCHASE, icon: IconPurchase},
];

const tabsSeting = [
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

  const {
    getUserProfile,
    selectedChild,
    setSelectedChild,
    deviceToken,
    deleteChildren,
  } = useAuthenticationStore();
  const loading = useLoadingGlobal(false);

  const [tabParent, setTabparent] = useState(TabParentE.APP_BLOCK);

  const tabsBlock = useMemo(() => {
    if (isAndroid) {
      return lesson.blockedListAppsSystem.map(app => {
        return {
          id: app.package_name,
          name: app.app_name,
          icon: app.app_icon,
          token: app.package_name,
        };
      });
    } else {
      if (lesson.blockedAnonymousListAppsSystem?.categoryTokens?.length) {
        return (
          lesson.blockedAnonymousListAppsSystem?.categoryTokens?.map(
            (app, i) => {
              return {
                id: 'app.package_name',
                name: `C ${i + 1}`,
                icon: 'no_icon',
                token: app,
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

  const tabsPurchase = [
    {id: '4', name: '???.000 vnd', icon: IconDiamond},
    {id: '5', name: '???.000 vnd', icon: IconDiamond},
    {id: '6', name: '???.000 vnd', icon: IconDiamond},
  ];

  const [tabBlock, setTabBlock] = useState<string>(tabsBlock?.[0]?.name ?? '');

  const [tabSetting, setTabSetting] = useState<string>(tabsSeting[0]?.id ?? '');

  const [tabPurchase, setTabPurchase] = useState<string>(
    tabsPurchase[0]?.id ?? '',
  );
  const [userProfile, setUserProfile] = useState<data>();
  const [isChooseChildren, setIsChooseChildren] = useState<string>(
    selectedChild?._id || '',
  );
  const [isShowLimitOption, setIsShowLimitOption] = useState(false);
  const points = [100, 70, 50];
  const [point, setPoint] = useState(100);

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
        android: tabsBlock.map(t => {
          return {
            category: AppCategoryE.APP,
            token: t.token,
          };
        }),
        ios: tabsBlock.map(t => {
          return {
            category: AppCategoryE.APP,
            token: t.token,
          };
        }),
      },
    });
  }, [deviceToken, lesson, point, selectedChild?._id, tabsBlock]);

  useEffect(() => {
    handleGetUserProfile();
  }, [handleGetUserProfile]);

  const tabsBody = useMemo(() => {
    switch (tabParent) {
      case TabParentE.APP_BLOCK:
        return tabsBlock;
      case TabParentE.SETTING:
        return tabsSeting;
      case TabParentE.PURCHASE:
        return tabsPurchase;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParent, tabsBlock]);

  const tabBody = useMemo(() => {
    switch (tabParent) {
      case TabParentE.APP_BLOCK:
        return tabBlock;
      case TabParentE.SETTING:
        return tabSetting;
      case TabParentE.PURCHASE:
        return tabPurchase;
    }
  }, [tabBlock, tabParent, tabPurchase, tabSetting]);

  const setTabBody = useCallback(
    (id: string) => {
      switch (tabParent) {
        case TabParentE.APP_BLOCK:
          setTabBlock(id);
          break;
        case TabParentE.SETTING:
          setTabSetting(id);
          break;
        case TabParentE.PURCHASE:
          setTabPurchase(id);
          break;
      }
    },
    [tabParent],
  );

  useAsyncEffect(async () => {
    loading.show();
    await lesson.changeListAppSystem();
    loading.hide();
  }, []);

  const buildBodyContent = useMemo(() => {
    if (tabParent === TabParentE.APP_BLOCK) {
      return (
        <View style={[styles.rowBetween]}>
          <View style={[styles.fill, styles.rowBetween]}>
            <View style={[styles.fill, {zIndex: 999}]}>
              <View style={[{zIndex: 999}]}>
                <Text style={[globalStyle.txtButton, styles.textColor]}>
                  App to lock
                </Text>

                <>
                  <SelectApp
                    appName={tabBody.trim() !== '' ? tabBody : 'select apps'}
                  />
                </>
              </View>
              <View style={[]}>
                <Text style={[globalStyle.txtButton, styles.textColor]}>
                  Lessons to unlock
                </Text>
                <View style={[styles.card]}>
                  <Text style={[globalStyle.txtButton, styles.textCard]}>
                    Vietnamese
                  </Text>
                  <IconArrowDown />
                </View>
              </View>
            </View>
            <View style={[styles.fill]}>
              <TouchableOpacity
                onPress={() => {
                  setIsShowLimitOption(v => !v);
                }}
                activeOpacity={1}
                style={[]}>
                <Text style={[globalStyle.txtButton, styles.textColor]}>
                  Score to unlock
                </Text>
                <View style={[styles.card, {zIndex: 999}]}>
                  <Text style={[globalStyle.txtButton, styles.textCard]}>
                    {point}%
                  </Text>
                  <IconArrowUp />
                </View>
              </TouchableOpacity>
              {isShowLimitOption && (
                <View style={styles.dropdown}>
                  {points
                    .filter(e => e !== point)
                    .map((p, i) => {
                      return (
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => {
                            setPoint(p);
                            setIsShowLimitOption(false);
                          }}
                          style={
                            i !== points.length - 1
                              ? {
                                  borderBottomWidth: 0.5,
                                  borderColor: COLORS.GREEN_1C6A59,
                                }
                              : {}
                          }>
                          <Text style={[globalStyle.txtNote, styles.option]}>
                            {p}%
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  {/* <View
                    style={{
                      borderBottomWidth: 0.5,
                      borderColor: COLORS.GREEN_1C6A59,
                    }}>
                    <Text style={[globalStyle.txtNote, styles.option]}>
                      70%
                    </Text>
                  </View>
                  <View>
                    <Text style={[globalStyle.txtNote, styles.option]}>
                      50%
                    </Text>
                  </View> */}
                </View>
              )}
              <View style={[{zIndex: -2}]}>
                <Text style={[globalStyle.txtButton, styles.textColor]}>
                  Your unlock score
                </Text>
                <View style={[styles.card, {opacity: 0.6}]}>
                  <Text style={[globalStyle.txtButton, styles.textCard]}>
                    100
                  </Text>
                  <IconArrowUp />
                </View>
              </View>
            </View>
          </View>
          <View>
            <View style={[styles.fill]} />
            <PrimaryButton
              text="Unlock"
              style={[styles.btnCommon, styles.btnRed]}
              onPress={async () => {
                try {
                  await unBlockApps();
                } catch (error) {
                } finally {
                  lesson.changeBlockedAnonymousListAppSystem(undefined);
                  lesson.resetListAppSystem();
                }
              }}
            />
            <PrimaryButton
              onPress={onConfigUserSetting}
              text="Save"
              style={[styles.btnCommon]}
              isLoading={lesson.isLoadingUserSetting}
            />
          </View>
        </View>
      );
    } else if (tabParent === TabParentE.SETTING) {
      switch (tabSetting) {
        case TabSettingE.SOUND:
          return (
            <View style={[styles.rowBetween]}>
              <View style={[styles.fill, styles.mr32]}>
                <Text style={[globalStyle.txtButton, styles.textColor]}>
                  Background sound
                </Text>
                <View style={[styles.mb12, styles.mt4]}>
                  <Volume value={80} onChangValue={v => console.log(v)} />
                </View>

                <Text style={[globalStyle.txtButton, styles.textColor]}>
                  Character sound
                </Text>
                <View style={[styles.mb12, styles.mt4]}>
                  <Volume value={30} onChangValue={v => console.log(v)} />
                </View>
              </View>
              <View>
                <View style={[styles.fill]} />
                <PrimaryButton text="Save" style={[styles.btnCommon]} />
              </View>
            </View>
          );
      }
    } else if (tabParent === TabParentE.PURCHASE) {
    }
    return (
      <View>
        <Text style={[globalStyle.txtLabel, styles.textColor, styles.mb12]}>
          Coming soon
        </Text>
        <Text style={[globalStyle.txtNote, styles.textColor, styles.mb12]}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text
          Lorem Ipsum has been....
        </Text>
      </View>
    );
  }, [
    tabParent,
    globalStyle.txtLabel,
    globalStyle.txtNote,
    globalStyle.txtButton,
    tabBody,
    point,
    isShowLimitOption,
    points,
    onConfigUserSetting,
    lesson,
    tabSetting,
  ]);

  return (
    <View style={[styles.fill, styles.bg, {paddingTop: insets.top}]}>
      <View style={[styles.head]}>
        <View style={[styles.rowBetween]}>
          <AccountStatus isShowLogout={true} />
        </View>
        <View style={[styles.profile]}>
          <IconUser width={70} height={70} />
        </View>
        <Username />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : undefined}
        style={styles.fill}
        contentContainerStyle={styles.fill}>
        <BookView style={[styles.mt16, styles.fill]}>
          <ScrollView contentContainerStyle={[styles.bookContent]}>
            <View style={[styles.rowBetween, styles.ph16]}>
              {tabsData.map(t => (
                <ItemCard
                  key={t.id}
                  name={t.name}
                  Icon={t.icon}
                  isFocus={tabParent === t.id}
                  onPress={() => setTabparent(t.id)}
                />
              ))}
            </View>
            <View style={[styles.bodyBook]}>
              <Text style={[globalStyle.txtLabel, styles.txtTitleBook]}>
                {tabParent}
              </Text>

              <ListBlockedApps
                setTabBody={setTabBody}
                setSelectedApp={tabBody}
                listApp={tabsBody}
              />
            </View>
            <View style={[styles.bodyContent, styles.rowBetween]}>
              {buildBodyContent}
            </View>
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
  profile: {
    height: 120,
    width: 120,
    backgroundColor: '#FFE699',
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#F2B559',
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
  btnCommon: {
    width: 80,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  btnRed: {
    backgroundColor: '#F28759',
  },
  card: {
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
    paddingHorizontal: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE699',
    alignSelf: 'flex-start',
    marginRight: scale(8),
    marginTop: verticalScale(6),
    marginBottom: verticalScale(12),
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
    width: 70,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  option: {
    paddingVertical: verticalScale(6),
    color: COLORS.GREEN_1C6349,
  },
});
