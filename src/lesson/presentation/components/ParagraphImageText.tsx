import React from 'react';
import {ImageStyle, StyleProp, StyleSheet, Text, View} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {COLORS} from 'src/core/presentation/constants/colors';
import ScrollIndicator from './ScrollIndicator';
import FastImage from 'react-native-fast-image';

type ParagraphImageTextProps = {
  imageUrl: string;
  paragraph: string;
};

const ParagraphImageText: React.FC<ParagraphImageTextProps> = ({
  imageUrl,
  paragraph,
}) => {
  return (
    <View style={[styles.box]}>
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        style={[styles.imageStyle]}
        source={{uri: imageUrl}}
      />
      <ScrollIndicator
        containerStyle={styles.boxParagraph}
        indicatorContainerColor={COLORS.YELLOW_E6960B}
        indicatorColor={COLORS.YELLOW_E6960B}>
        <Text style={styles.textParagraph}>{paragraph}</Text>
      </ScrollIndicator>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: scale(20),
    padding: scale(10),
    marginTop: verticalScale(70),
    width: scale(170),
    aspectRatio: 1,
    borderWidth: scale(2),
    borderColor: COLORS.YELLOW_E6960B,
    borderStyle: 'dashed',
    paddingTop: verticalScale(50),
  },
  boxParagraph: {
    alignSelf: 'center',
  },
  imageStyle: {
    position: 'absolute',
    top: verticalScale(-60),
    alignSelf: 'center',
    width: '70%',
    height: verticalScale(110),
  },
  textParagraph: {
    fontFamily: FontFamily.SVNNeuzeitRegular,
    fontSize: verticalScale(14),
    color: COLORS.RED_BA3201,
    letterSpacing: 0.1,
  },
});

export default ParagraphImageText;
