import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {assets} from '../utils';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from '../constants/colors';
import {FontFamily} from '../hooks/useFonts';

const WatchAdsModal = () => {
  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <View>
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
            <Text style={styles.text}>
              <Text style={styles.txtHint}>
                Watch AD and collect 1 sunflower. {'\n'}
              </Text>
              Have 3 sunflower to get hint for 1 Minitest question.
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.txtButton}>Skip AD</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.txtButton}>Watch AD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WatchAdsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: scale(230),
    width: scale(198),
    alignSelf: 'center',
    marginTop: -150,
  },
  modalContainer: {
    backgroundColor: COLORS.WHITE_FBF8CC,

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
    color: COLORS.GREEN_4CB572,
  },
  txtHint: {
    fontFamily: FontFamily.Eina01Bold,
    fontSize: moderateScale(12),
  },
  text: {
    color: COLORS.BLUE_1C6349,
    textAlign: 'center',
  },
  txtButton: {
    fontFamily: FontFamily.Eina01Bold,
    fontSize: moderateScale(18),
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
  },
});
