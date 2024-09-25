import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {ImageBackground} from 'react-native';
import {assets, HEIGHT_SCREEN, timeout, WIDTH_SCREEN} from '../utils';
import {COLORS} from '../constants/colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Image} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {FontFamily} from '../hooks/useFonts';
import {useAsyncEffect} from '../hooks';

type Props = {
  onWatchRewardAds: () => void;
  loadedAds: boolean;
};
const WatchAddScreen = ({onWatchRewardAds, loadedAds}: Props) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withTiming(1, {duration: 500});
    translateY.value = withTiming(0, {duration: 500});
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateY: translateY.value}],
    };
  });

  useAsyncEffect(async () => {
    await timeout(4000);
    onWatchRewardAds();
  }, []);

  return (
    <ImageBackground style={styles.container} source={assets.authBackground}>
      <Animated.View style={[styles.modalContainer, animatedStyle]}>
        <View style={styles.image}>
          <Image
            source={assets.watch_ads}
            style={{height: '100%', width: '100%'}}
            resizeMode="contain"
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>WATCH AD FOR REWARD</Text>
          <View style={{height: verticalScale(8)}} />
          <Text style={styles.txtHint}>
            Watch AD and collect 1 sunflower. {'\n'}
          </Text>
          <Text style={styles.text}>
            Have 2 sunflower to get hint for 1 Minitest question.
          </Text>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

export default WatchAddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.YELLOW_F2B559,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: scale(230),
    width: scale(198),
    alignSelf: 'center',
    marginTop: -150,
  },
  modalContainer: {
    borderRadius: scale(30),
    marginHorizontal: scale(20),
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.SVNCherishMoment,
    fontSize: moderateScale(32),
    textAlign: 'center',
    maxWidth: scale(140),
    color: COLORS.RED_AF3A1B,
  },
  txtHint: {
    fontFamily: FontFamily.Eina01Bold,
    fontSize: moderateScale(12),
    color: COLORS.RED_AF3A1B,
  },
  text: {
    color: COLORS.RED_AF3A1B,
    textAlign: 'center',
    fontSize: moderateScale(12),
    maxWidth: scale(160),
  },
  txtButton: {
    fontFamily: FontFamily.Eina01Bold,
    fontSize: moderateScale(18),
    color: COLORS.WHITE_FBF8CC,
  },
  button: {
    backgroundColor: COLORS.RED_F28759,
    height: verticalScale(44),
    width: scale(112),
    borderRadius: verticalScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
});
