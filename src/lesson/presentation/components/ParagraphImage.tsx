import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {COLORS} from 'src/core/presentation/constants/colors';

type ParagraphImageProps = {
  imageUrl: string;
  name: string;
  paragraph: string;
};

const ParagraphImage: React.FC<ParagraphImageProps> = ({
  imageUrl,
  name,
  paragraph,
}) => {
  return (
    <View>
      <ImageBackground
        resizeMode={'cover'}
        style={[
          {
            width: scale(170),
            aspectRatio: 0.7,
          },
        ]}
        source={{uri: imageUrl}}>
        <View style={styles.boxName}>
          <Text style={styles.textParagraph}>{name}</Text>
        </View>
        <ScrollView style={styles.boxParagraph}>
          <Text style={styles.textParagraph}>{paragraph}</Text>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  boxParagraph: {
    height: verticalScale(100),
    alignSelf: 'center',
    position: 'absolute',
    bottom: verticalScale(0),
    left: 0,
    right: 0,
    paddingHorizontal: scale(10),
  },
  boxName: {
    position: 'absolute',
    top: verticalScale(0),
    left: 0,
    right: 0,
    alignItems: 'center',
    height: verticalScale(30),
    justifyContent: 'center',
  },
  textParagraph: {
    fontFamily: FontFamily.SVNNeuzeitRegular,
    fontSize: verticalScale(14),
    color: COLORS.GREEN_258F78,
    letterSpacing: 0.1,
  },
});

export default ParagraphImage;
