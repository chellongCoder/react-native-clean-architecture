import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {scale} from 'react-native-size-matters';
import ICStar from 'src/core/components/icons/ICStar';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import useLoginWithCredentials from 'src/authentication/presentation/hooks/useLoginWithCredentials';
import ICLogout from 'src/core/components/icons/ICLogout';
import CustomSwitchNew from './CustomSwitchNew';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import Diamond from './Diamond';

type TProps = {
  title?: string;
  subject?: string;
  isShowLogout?: boolean;
  isParentScreen?: boolean;
  diamond?: number;
};

const AccountStatus = (props: TProps) => {
  const {title, subject, isShowLogout, isParentScreen, diamond} = props;
  const {handleLogOut} = useLoginWithCredentials();
  useLoadingGlobal();
  const {selectedChild} = useAuthenticationStore();

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
        {isParentScreen ? (
          <Diamond diamond={diamond} />
        ) : (
          <CustomSwitchNew
            point={selectedChild?.adsPoints ?? 0}
            value={isEnabled}
            onValueChange={setIsEnabled}
          />
        )}
      </View>
      <View style={styles.iconContainer}>
        {subject ? (
          <View>
            <Text style={styles.subTitle}>{subject}</Text>
          </View>
        ) : (
          <View style={{flex: 1}} />
        )}
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
