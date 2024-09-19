import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {assets} from '../utils';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from '../constants/colors';
import {FontFamily} from '../hooks/useFonts';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  onWatchRewardAds: () => void;
  loadedAds: boolean;
};
const GotRewardModal = ({onWatchRewardAds, loadedAds}: Props) => {
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
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.modalContainer, animatedStyle]}>
        <View style={styles.image}>
          <Image
            source={assets.untitled_artwork}
            style={{height: '100%', width: '100%'}}
            resizeMode="contain"
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>YOU GOT REWARD !!</Text>
          <View style={{height: verticalScale(8)}} />
          <Text style={styles.text}>
            Yayyyy !!! You got
            <Text style={styles.txtHint}> 1 sunflower. {'\n'}</Text>
            You can use 3 sunflower seeds to hint 1 minitest question.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onWatchRewardAds}
            style={[styles.button, {backgroundColor: COLORS.YELLOW_F2B559}]}>
            <Text style={styles.txtButton}>Get reward</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default GotRewardModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.CUSTOM(COLORS.BLACK, 0.4),
  },
  image: {
    height: scale(230),
    width: scale(198),
    alignSelf: 'center',
    marginTop: -150,
  },
  modalContainer: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: scale(30),
    marginHorizontal: scale(20),
  },
  contentContainer: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    fontFamily: FontFamily.SVNCherishMoment,
    fontSize: moderateScale(32),
    textAlign: 'center',
    color: COLORS.GREEN_4CB572,
  },
  txtHint: {
    fontFamily: FontFamily.Eina01Bold,
    fontSize: moderateScale(12),
  },
  text: {
    color: COLORS.BLUE_1C6349,
    textAlign: 'center',
    fontSize: moderateScale(12),
    maxWidth: '60%',
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
