import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {verticalScale, scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import ScrollIndicator from '../ScrollIndicator';

type Props = {
  title?: string;
  description?: string;
  imageUrl?: string;
};

const ExplainImage = ({
  title = 'WARM TEMPERATURES AND CLEAR SKIES',
  description = 'Great for outdoor activities like playing in the park.',
  imageUrl = 'https://openweathermap.org/img/wn/01d@4x.png', // Real sun icon with size parameter @4x
}: Props) => {
  return (
    <View style={styles.container}>
      <ScrollIndicator>
        <View style={styles.card}>
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>{title}</Text>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
          </View>
        </View>
      </ScrollIndicator>
      <View style={styles.imageContainer}>
        <Image source={{uri: imageUrl}} style={styles.sunImage} />
      </View>
    </View>
  );
};

export default ExplainImage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8E1', // Light yellow/cream background
    padding: scale(16),
    minHeight: verticalScale(200),
    justifyContent: 'center',
    borderRadius: scale(30),
  },
  card: {
    borderRadius: scale(20),
    borderWidth: scale(3),
    borderColor: '#FFB366', // Orange border like in the image
    padding: scale(20),
    marginRight: scale(30),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: scale(16),
  },
  titleText: {
    fontSize: verticalScale(24),
    color: '#4CAF50', // Green color for title
    textAlign: 'left',
    marginBottom: verticalScale(12),
    fontFamily: FontFamily.SVNCherishMoment,
  },
  descriptionText: {
    fontSize: verticalScale(25),
    color: COLORS.BLUE_258F78, // Using the same blue from TextHighlight
    textAlign: 'left',
    fontFamily: FontFamily.SVNNeuzeitBold,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -verticalScale(10),
    right: -verticalScale(0),
  },
  sunImage: {
    width: scale(110),
    height: scale(110),
    borderRadius: scale(40),
  },
});
