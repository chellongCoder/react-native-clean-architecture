import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {scale} from 'react-native-size-matters';
import ICDropDown from 'src/core/components/icons/ICDropDown';
import ICManIconMedium from 'src/core/components/icons/ICManIconMedium';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import useAuthenticationStore from '../stores/useAuthenticationStore';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {
  pushScreen,
  resetNavigator,
} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import ICAddChild from 'src/core/components/icons/ICAddChild';
import {
  data,
  children,
} from 'src/authentication/application/types/GetUserProfileResponse';

const screenWidth = Dimensions.get('screen').width;

const ListChildrenScreen = () => {
  const {removeCurrentCredentials, getUserProfile, setSelectedChild} =
    useAuthenticationStore();
  useLoadingGlobal();

  const [userProfile, setUserProfile] = useState<data>();
  const [isChooseChildren, setIsChooseChildren] = useState<string>();

  const onLogout = () => {
    removeCurrentCredentials();
    resetNavigator(STACK_NAVIGATOR.AUTH_NAVIGATOR);
  };

  const onAddChild = () => {
    resetNavigator(STACK_NAVIGATOR.AUTH.REGISTER_CHILD_SCREEN);
  };

  const onSelectChild = (item: children) => {
    setIsChooseChildren(item._id);
    setSelectedChild(item);
  };

  const onEnter = () => {
    if (isChooseChildren) {
      pushScreen(STACK_NAVIGATOR.BOTTOM_TAB_SCREENS);
    }
  };

  const handleGetUserProfile = useCallback(async () => {
    const res = await getUserProfile();
    if (res.data) {
      setUserProfile(res.data);
    }
  }, [getUserProfile]);

  useEffect(() => {
    handleGetUserProfile();
  }, [handleGetUserProfile]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.wrapContainer}>
        <TouchableOpacity style={styles.wrapHeaderContainer}>
          <Text style={styles.headerTitle}>Eng</Text>
          <ICDropDown />
        </TouchableOpacity>

        <View style={styles.wrapBodyContainer}>
          <View style={styles.bigCircle}>
            <View style={styles.mediumCircle}>
              <ICManIconMedium />
            </View>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.title}>Hi, Welcome back</Text>
            <Text style={styles.titleBold}>{userProfile?.username}</Text>
            <TouchableOpacity onPress={onLogout}>
              <Text style={styles.logoutTitle}>Another account?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.wrapBottomContainer}>
        <View style={styles.square} />

        <View>
          <Text style={styles.bottomTitle}>Children account</Text>
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

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.wrapBottomButtonContainer}
            onPress={onEnter}>
            <Text style={styles.bottomButtonTitle}>Enter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE_FBF8CC,
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
    marginTop: scale(32),
  },
  bigCircle: {
    height: scale(150),
    width: scale(150),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.YELLOW_F2B559,
    borderRadius: 999,
    marginBottom: scale(16),
  },
  mediumCircle: {
    height: scale(125),
    width: scale(125),
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
    marginBottom: scale(24),
  },
  logoutTitle: {
    ...CustomTextStyle.smallNormal,
    color: COLORS.BLUE_1C6349,
    textDecorationLine: 'underline',
  },
  wrapBottomContainer: {
    flex: 1,
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
    marginTop: scale(54),
  },
  wrapBottomButtonContainer: {
    marginTop: scale(56),
    alignItems: 'center',
    paddingVertical: scale(6),
    width: '25%',
    backgroundColor: COLORS.GREEN_66C270,
    borderRadius: scale(4),
  },
  wrapAddChildContainer: {
    flexDirection: 'row',
    marginTop: scale(16),
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
