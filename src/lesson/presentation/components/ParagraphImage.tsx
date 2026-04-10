import React from 'react';
import {ImageStyle, StyleProp, StyleSheet, Text, View} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {COLORS} from 'src/core/presentation/constants/colors';
import ScrollIndicator from './ScrollIndicator';
import FastImage from 'react-native-fast-image';

type ParagraphImageProps = {
  imageUrl: string;
  name?: string;
  paragraph: string;
  imageStyle?: StyleProp<ImageStyle>;
};

const ParagraphImage: React.FC<ParagraphImageProps> = ({
  imageUrl,
  name,
  paragraph,
  imageStyle,
}) => {
  return (
    <View>
      <View
        style={[
          {
            width: scale(170),
            aspectRatio: 0.7,
          },
          imageStyle,
        ]}>
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          style={StyleSheet.absoluteFill}
          source={{uri: imageUrl}}
        />
        <View style={styles.boxName}>
          <Text style={styles.boxText}>{name}</Text>
        </View>
        <ScrollIndicator
          containerStyle={styles.boxParagraph}
          nestedScrollEnabled={true}>
          <Text style={styles.textParagraph}>{paragraph}</Text>
        </ScrollIndicator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boxParagraph: {
    height: verticalScale(80),
    alignSelf: 'center',
    position: 'absolute',
    bottom: verticalScale(0),
    left: 0,
    right: 0,
    paddingHorizontal: scale(10),
  },
  boxName: {
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  boxText: {
    fontFamily: FontFamily.SVNCherishMoment,
    fontSize: verticalScale(12),
    color: COLORS.BLUE_0877B6,
  },
  textParagraph: {
    fontFamily: FontFamily.SVNNeuzeitRegular,
    fontSize: verticalScale(10),
    color: COLORS.GREEN_258F78,
    letterSpacing: 0.1,
  },
});

export default ParagraphImage;
