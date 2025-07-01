import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../constants/colors';
import {FontFamily} from '../hooks/useFonts';
import {assets} from '../utils';
import {STACK_NAVIGATOR} from '../navigation/ConstantNavigator';
import {navigateScreen} from '../navigation/actions/RootNavigationActions';

const ComingSoonScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.view}>
        <View style={styles.border}>
          <View style={styles.imageContainer}>
            <Image source={assets.bee_trans} style={styles.image} />
          </View>
          <Text style={styles.title}>Coming Soon</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigateScreen(STACK_NAVIGATOR.BOTTOM_TAB.HOME_TAB, {}); // Adjust the screen name as needed
            }}>
            <Text style={styles.text}>Go to Homepage</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ComingSoonScreen;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  view: {
    padding: scale(10),
    marginHorizontal: scale(20),
    borderRadius: scale(20),
    backgroundColor: COLORS.WHITE_FBF8CC,
  },
  border: {
    borderWidth: 2,
    borderColor: COLORS.GREEN_4CB572,
    borderStyle: 'dashed',
    padding: scale(20),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(40),
  },
  image: {
    position: 'absolute',
    bottom: scale(-45),
    width: scale(200),
    height: scale(200),
    marginBottom: scale(20),
  },
  button: {
    backgroundColor: COLORS.YELLOW_F2B559,
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    borderRadius: scale(50),
    marginTop: scale(10),
  },
  text: {
    fontSize: scale(16),
    color: COLORS.WHITE_FBF8CC,
    fontFamily: FontFamily.SVNNeuzeitBold,
  },
  title: {
    fontSize: scale(36),
    fontFamily: FontFamily.SVNCherishMoment,
    color: COLORS.GREEN_4CB572,
    marginBottom: scale(14),
  },
});
