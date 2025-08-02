import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale, verticalScale} from 'react-native-size-matters';
import ICManIconMedium from 'src/core/components/icons/ICManIconMedium';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import useAuthenticationStore from '../stores/useAuthenticationStore';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {
  navigateScreen,
  pushScreen,
} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import ICAddChild from 'src/core/components/icons/ICAddChild';
import {
  data,
  children,
} from 'src/authentication/application/types/GetUserProfileResponse';
import {useOfflineMode} from 'src/core/presentation/hooks/offline/useOfflineMode';
import {OfflineEnum} from 'src/core/presentation/hooks/offline/OfflineEnum';
import {observer} from 'mobx-react';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import Dropdown from 'src/core/components/dropdown/Dropdown';
import PrimaryButton from '../components/PrimaryButton';

const screenWidth = Dimensions.get('screen').width;

const ListChildrenScreen = observer(() => {
  const {handleUserLogOut, getUserProfile, setSelectedChild} =
    useAuthenticationStore();
  const {storeData, getData, isConnected} = useOfflineMode();
  useLoadingGlobal();
  const i18n = useI18n();
  const [lang, setLang] = useState('Eng');
  const insets = useSafeAreaInsets();

  const [userProfile, setUserProfile] = useState<data>();
  const [isChooseChildren, setIsChooseChildren] = useState<string>();

  const onLogout = () => {
    handleUserLogOut();
  };

  const onAddChild = () => {
    navigateScreen(STACK_NAVIGATOR.AUTH.REGISTER_CHILD_SCREEN, {});
  };

  const onSelectChild = (item: children) => {
    setIsChooseChildren(item._id);
    setSelectedChild(item);
  };

  const onEnter = () => {
    if (isChooseChildren) {
      pushScreen(STACK_NAVIGATOR.BOTTOM_TAB_SCREENS, {});
    }
  };

  const handleGetUserProfile = useCallback(async () => {
    const res = await getUserProfile();
    if (res.data) {
      storeData(OfflineEnum.USER_PROFILE, res.data);
      setUserProfile(res.data);
    }
  }, [getUserProfile, storeData]);

  useEffect(() => {
    handleGetUserProfile();
  }, [handleGetUserProfile]);

  useEffect(() => {
    const getDataFromStore = async () => {
      if (!isConnected) {
        const res = await getData(OfflineEnum.USER_PROFILE);
        setUserProfile(res);
      }
    };

    getDataFromStore();
  }, [getData, isConnected]);

  useEffect(() => {
    if (userProfile?.hasPassword === false) {
      navigateScreen(STACK_NAVIGATOR.AUTH.CHANGE_PASSWORD, {});
    }
  }, [userProfile?.hasPassword]);

  return (
    <ImageBackground
      style={[styles.container]}
      source={require('../../../../assets/images/authBackground.png')}>
      <View style={styles.overlay} />
      <SafeAreaView style={[styles.container]} edges={['top']}>
        <View style={styles.wrapContainer}>
          <Dropdown
            title={lang}
            width={scale(76)}
            onSelectItem={item => setLang(item)}
            data={['Eng', 'Vie']}
          />

          <View style={styles.wrapBodyContainer}>
            <View style={styles.bigCircle}>
              <View style={styles.mediumCircle}>
                <ICManIconMedium
                  width={scale(15).toString()}
                  height={scale(15).toString()}
                />
              </View>
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.title}>
                {i18n.t('authentication.screens.ListChildren.hiWelcomeBack')}
              </Text>
              <Text style={styles.titleBold}>{userProfile?.username}</Text>
              {isConnected && (
                <TouchableOpacity onPress={onLogout}>
                  <Text style={styles.logoutTitle}>
                    {i18n.t(
                      'authentication.screens.ListChildren.anotherAccount',
                    )}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View
          style={[styles.wrapBottomContainer, {paddingBottom: insets.bottom}]}>
          <View style={styles.square} />

          <View>
            <Text style={styles.bottomTitle}>
              {i18n.t('authentication.screens.ListChildren.childrenAccount')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.wrapAddChildContainer}>
                {userProfile?.children.map((item: children) => {
                  return (
                    <View style={{alignItems: 'center', marginRight: scale(8)}}>
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
              {userProfile?.children &&
                userProfile?.children.length < 5 &&
                isConnected && (
                  <View style={styles.wrapAddChildContainer}>
                    <View
                      style={{
                        alignItems: 'center',
                        opacity: userProfile?.children.length > 0 ? 0.5 : 1,
                      }}>
                      <TouchableOpacity
                        style={styles.addChildContainer}
                        onPress={onAddChild}
                        disabled={userProfile?.children.length > 0}>
                        <ICAddChild />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
            </ScrollView>
          </View>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {/* <TouchableOpacity
              style={styles.wrapBottomButtonContainer}
              onPress={onEnter}>
              <Text style={styles.bottomButtonTitle}>
                {i18n.t('authentication.screens.ListChildren.enter')}
              </Text>
            </TouchableOpacity> */}
            <PrimaryButton
              text={i18n.t('authentication.screens.ListChildren.enter')}
              onPress={onEnter}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // This makes the overlay fill the entire ImageBackground
    backgroundColor: '#fbf8cc', // Adjust the color and opacity as needed
    opacity: 0.9,
  },
  wrapContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingBottom: scale(32),
  },
  wrapHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE_FFE699,
    paddingVertical: scale(4),
    borderRadius: 30,
    paddingLeft: scale(12),
    width: '20%',
  },
  headerTitle: {
    ...CustomTextStyle.smallBold,
    color: COLORS.BLUE_1C6349,
    marginRight: scale(8),
  },
  wrapBodyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(32),
    flexDirection: 'column',
    gap: verticalScale(16),
  },
  bigCircle: {
    height: scale(50),
    width: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.YELLOW_F2B559,
    borderRadius: 999,
    // marginBottom: scale(16),
  },
  mediumCircle: {
    height: scale(30),
    width: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE_FFE699,
    borderRadius: 999,
  },
  bodyContainer: {
    alignItems: 'center',
  },
  title: {
    ...CustomTextStyle.body1,
    color: COLORS.BLUE_1C6349,
  },
  titleBold: {
    ...CustomTextStyle.body1_bold,
    color: COLORS.BLUE_1C6349,
    // marginBottom: scale(24),
  },
  logoutTitle: {
    ...CustomTextStyle.smallNormal,
    color: COLORS.BLUE_1C6349,
    textDecorationLine: 'underline',
  },
  wrapBottomContainer: {
    backgroundColor: COLORS.GREEN_DDF598,
    borderTopRightRadius: 48,
    borderTopLeftRadius: 48,
    paddingHorizontal: scale(24),
  },
  square: {
    height: scale(24),
    width: scale(24),
    backgroundColor: COLORS.WHITE_FBF8CC,
    position: 'absolute',
    left: screenWidth / 2 - scale(12),
    transform: [{rotate: '45deg'}],
    top: scale(-12),
  },
  bottomTitle: {
    ...CustomTextStyle.body1_bold,
    color: COLORS.BLUE_1C6349,
    marginVertical: verticalScale(25),
  },
  wrapBottomButtonContainer: {
    marginTop: scale(26),
    alignItems: 'center',
    paddingVertical: scale(8),
    width: '30%',
    backgroundColor: COLORS.GREEN_66C270,
    borderRadius: scale(87),
  },
  wrapAddChildContainer: {
    flexDirection: 'row',
    // marginTop: scale(16),
  },
  bottomButtonTitle: {
    ...CustomTextStyle.body1,
    color: COLORS.WHITE_FBF8CC,
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
});

export default ListChildrenScreen;
