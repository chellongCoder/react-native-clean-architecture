import React, {View, Text, StyleSheet, Image} from 'react-native';
import useGlobalStyle from '../hooks/useGlobalStyle';
import {assets} from '../utils';
import {useCodePush} from '../hooks/useCodePush';
import DeviceInfo from 'react-native-device-info';
import { COLORS } from '../constants/colors';
import { verticalScale } from 'react-native-size-matters';

const OnBoardingScreen = ({navigation}: any) => {
  const styleHook = useGlobalStyle();
  const {metaData} = useCodePush();
  const version = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  return (
    <View style={styles.container}>
      <Image
        source={assets.onboarding}
        style={{height: '100%', width: '100%'}}
        resizeMode="cover"
      />
      <Text style={styles.versionText}>
        v{version} ({buildNumber}) {metaData?.label ? ` - ${metaData.label}` : ''}
      </Text>
    </View>
  );
};

export default OnBoardingScreen;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontWeight: '400',
    fontSize: 40,
    textAlign: 'center',
    color: '#FBF8CC',
    transform: [{translateY: 200}],
  },
  versionText: {
    position: 'absolute',
    bottom: verticalScale(20),
    alignSelf: 'center',
    fontSize: verticalScale(14),
    color: COLORS.WHITE,
    opacity: 0.6,
  },
});
