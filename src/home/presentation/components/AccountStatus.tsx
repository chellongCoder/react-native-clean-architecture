import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {scale} from 'react-native-size-matters';
import ICStar from 'src/core/components/icons/ICStar';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import useLoginWithCredentials from 'src/authentication/presentation/hooks/useLoginWithCredentials';
import ICLogout from 'src/core/components/icons/ICLogout';
import CustomSwitchNew from './CustomSwitchNew';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import Diamond from './Diamond';
import {goBack} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {useI18n} from 'src/core/presentation/hooks/useI18n';

type TProps = {
  title?: string;
  subject?: string;
  isShowLogout?: boolean;
  isShowDiamond?: boolean;
  diamond?: number;
};

const AccountStatus = (props: TProps) => {
  const {title, subject, isShowLogout, isShowDiamond, diamond} = props;
  const {handleLogOut} = useLoginWithCredentials();
  const {selectedChild} = useAuthenticationStore();
  const i18n = useI18n();

  const [isEnabled, setIsEnabled] = useState(false);

  const onLogout = () => {
    goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {isShowLogout && (
          <TouchableOpacity
            style={styles.wrapLogoutContainer}
            onPress={onLogout}>
            <ICLogout />
            <Text style={styles.logoutTitle}>
              {i18n.t('lesson.screens.Parent.back')}
            </Text>
          </TouchableOpacity>
        )}
        {title ? (
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subTitle}>{subject}</Text>
          </View>
        ) : (
          <View style={{flex: 1}} />
        )}
        {isShowDiamond ? (
          <Diamond diamond={diamond} />
        ) : (
          <CustomSwitchNew
            point={selectedChild?.adsPoints ?? 0}
            value={isEnabled}
            onValueChange={setIsEnabled}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    width: '100%',
    alignContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  wrapIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(8),
  },
  wrapLogoutContainer: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
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
    textAlign: 'center',
  },
  text: {
    ...CustomTextStyle.smallBold,
    color: COLORS.BLUE_1C6349,
    marginRight: scale(4),
  },
});

export default AccountStatus;
