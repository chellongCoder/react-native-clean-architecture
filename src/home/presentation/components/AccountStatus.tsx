import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {scale} from 'react-native-size-matters';
import ICStar from 'src/core/components/icons/ICStar';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import CustomSwitch from './CustomSwitch';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import useLoginWithCredentials from 'src/authentication/presentation/hooks/useLoginWithCredentials';
import ICLogout from 'src/core/components/icons/ICLogout';
import ICStarMedium from 'src/core/components/icons/ICStarMedium';
import ICStarSmall from 'src/core/components/icons/ICStarSmall';
import CustomSwitchNew from './CustomSwitchNew';

type TProps = {
  title?: string;
  subject?: string;
  isShowLogout?: boolean;
};

const AccountStatus = (props: TProps) => {
  const {title, subject, isShowLogout} = props;
  const {handleLogOut} = useLoginWithCredentials();
  useLoadingGlobal();

  const [isEnabled, setIsEnabled] = useState(false);

  const onLogout = () => {
    handleLogOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {isShowLogout && (
          <TouchableOpacity
            style={styles.wrapLogoutContainer}
            onPress={onLogout}>
            <ICLogout />
            <Text style={styles.logoutTitle}>Log out</Text>
          </TouchableOpacity>
        )}
        {title ? (
          <View>
            <Text style={styles.title}>{title}</Text>
          </View>
        ) : (
          <View style={{flex: 1}} />
        )}
        <CustomSwitchNew value={isEnabled} onValueChange={setIsEnabled} />
      </View>
      <View style={styles.iconContainer}>
        {subject ? (
          <View>
            <Text style={styles.subTitle}>{subject}</Text>
          </View>
        ) : (
          <View style={{flex: 1}} />
        )}
        <View style={styles.wrapIconContainer}>
          <Text style={styles.text}>150</Text>
          <TouchableOpacity
            onPress={() => {
              navigateScreen(STACK_NAVIGATOR.BOTTOM_TAB.ACHIEVEMENT_TAB, {});
            }}>
            <ICStarSmall />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    width: '100%',
    paddingTop: scale(16),
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(8),
  },
  wrapLogoutContainer: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    backgroundColor: COLORS.GREEN_66C270,
    borderRadius: scale(30),
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutTitle: {
    marginLeft: scale(4),
    ...CustomTextStyle.captionBold,
    color: COLORS.BLUE_1C6349,
  },
  title: {
    ...CustomTextStyle.h1_SVNCherishMoment,
    color: COLORS.RED_F28759,
  },
  subTitle: {
    ...CustomTextStyle.h4_bold,
    color: COLORS.BLUE_258F78,
  },
  text: {
    ...CustomTextStyle.smallBold,
    color: COLORS.BLUE_1C6349,
    marginRight: scale(4),
  },
});

export default AccountStatus;
